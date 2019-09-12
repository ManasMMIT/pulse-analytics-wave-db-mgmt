require('dotenv').load()
const _ = require('lodash')
const stringSimilarity = require('string-similarity')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const {
  getClientController,
  getRoleController,
  getUserController,
  getNodeController,
} = require('./controllers')

const MongoClient = require('mongodb').MongoClient

const auth0 = require('./auth0')

const subApp = express()

MongoClient.connect(process.env.LOADER_URI, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const mongoClient = client
  const pulseRawDb = client.db('pulse-raw')
  const pulseDevDb = client.db('pulse-dev')
  const pulseCoreDb = client.db('pulse-core')
  const pulseProdDb = client.db('pulse-prod')

  const coreUsers = pulseCoreDb.collection('users')
  const coreRoles = pulseCoreDb.collection('roles')
  const coreNodes = pulseCoreDb.collection('nodes')
  const coreClients = pulseCoreDb.collection('clients')

  console.log(`Connected to MongoDB: ${process.env.LOADER_URI}`)

  const twoGuysInAHorseCostume = {
    // Head + front-hooves
    auth0,

    // Torso/Backside
    mongoClient,
    pulseRawDb,
    pulseDevDb,
    pulseCoreDb,
    pulseProdDb,

    coreUsers,
    coreRoles,
    coreClients,
    coreNodes,
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => twoGuysInAHorseCostume,
  })

  apolloServer.applyMiddleware({ app: subApp })

  const clientController = getClientController(twoGuysInAHorseCostume)
  const roleController = getRoleController(twoGuysInAHorseCostume)
  const userController = getUserController(twoGuysInAHorseCostume)
  const nodeController = getNodeController(twoGuysInAHorseCostume)

  subApp.use('/clients', clientController)
  subApp.use('/roles', roleController)
  subApp.use('/users', userController)
  subApp.use('/nodes', nodeController)

  subApp.use('/collections', async (req, res) => {
    const collections = await pulseRawDb.listCollections().toArray()
    res.json(collections.map(({ name }) => name))
  })

  subApp.post('/collection', async (req, res) => {
    const createdCollection = await pulseRawDb.createCollection(req.body.collectionName)
    res.send(createdCollection.collectionName)
  })

  subApp.post('/upload', async (req, res, next) => {
    const rawJson = req.body.data

    if (rawJson[0].indication) { // TODO: really? does every doc have the same keys?
      const indications = await pulseCoreDb.collection('indications').find().toArray()
      const validIndications = _.keyBy(indications, 'name')

      // add 1 for zero indexing, add 3 for rows skipped
      // (there are two special rows in the xlsx file and the header)
      const ROWS_TO_SKIP = 4

      const problemRows = []
      const invalidIndications = rawJson.filter(({ indication }, i) => {
        const isIndicationInvalid = !validIndications[indication]
        if (isIndicationInvalid) problemRows.push(i + ROWS_TO_SKIP)
        return isIndicationInvalid
      })

      const numInvalidIndications = invalidIndications.length

      if (numInvalidIndications > 0) {
        const uniqueInvalidIndications = _.uniqBy(invalidIndications, 'indication').map(({ indication }) => indication)

        const validIndicationArr = Object.keys(validIndications)
        const suggestions = uniqueInvalidIndications.map(invalidIndication => {
          const { bestMatch: { target } } = stringSimilarity.findBestMatch(invalidIndication, validIndicationArr)
          return { 'Invalid Indication': invalidIndication, 'Did you mean...?': target }
        })

        let errorMessage = `
          Indication validation failed!
          Incoming data has ${numInvalidIndications} invalid indication entries.
          Problem rows in CSV are: ${problemRows.join(', ')}
          Your unique invalid indications are:
          ${ suggestions }
        `

        console.table(suggestions, ['Invalid Indication', 'Did you mean...?'])

        next(errorMessage)
        return
      }
    }

    debugger

    const targetCollection = pulseRawDb.collection(req.body.collectionName)

    await targetCollection.deleteMany()
    await targetCollection.insertMany(req.body.data)

    const persistedData = await targetCollection.find().toArray()

    res.json(persistedData)
  })
})


module.exports = subApp
