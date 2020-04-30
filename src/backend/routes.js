require('dotenv').config()
const _ = require('lodash')

const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const {
  getNodeController,
  MerckPipeDelimitedCtrl,
  NovartisCsvCtrl,
} = require('./controllers')

const MongoClient = require('mongodb').MongoClient

const auth0 = require('./auth0')

const subApp = express()

MongoClient.connect(process.env.LOADER_URI, { useUnifiedTopology: true }, (err, client) => {
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
    context: ({ req }) => { // req/res comes in here https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserver
      const user = req.user['https://random-url-for-extra-user-info']

      return {
        ...twoGuysInAHorseCostume,
        user,
      }
    },
  })

  apolloServer.applyMiddleware({ app: subApp })

  const nodeController = getNodeController(twoGuysInAHorseCostume)

  subApp.use('/nodes', nodeController)

  const merckPipeDelimitedCtrl = new MerckPipeDelimitedCtrl(pulseDevDb)
  const novartisCsvCtrl = new NovartisCsvCtrl(pulseDevDb)

  subApp.get('/merck-pipe-delimited-file', merckPipeDelimitedCtrl.apiDownloadFiles)
  subApp.get('/novartis-csv-file', novartisCsvCtrl.apiDownloadFiles)

  subApp.use('/collections', async (req, res) => {
    const collections = await pulseRawDb.listCollections().toArray()
    res.json(collections.map(({ name }) => name))
  })

  subApp.post('/collection', async (req, res) => {
    const createdCollection = await pulseRawDb.createCollection(req.body.collectionName)
    res.send(createdCollection.collectionName)
  })

  const getErrorObj = require('./validation/getErrorObj')

  subApp.post('/upload', async ({
    body: {
      data,
      collectionName,
    }
  }, res, next) => {
    const errorObj = await getErrorObj(data,pulseCoreDb)

    /*
      ! Note on Error Management
      * Currently just sending an error slice to the frontend to manually throw
      * Still not sure how to accurately bubble up an express error to the frontend's catch
      * Might be solved when error handling is moved to graphql
    */

    const hasErrors = !_.isEmpty(errorObj)

    if (hasErrors) {
      res.status(400)
      res.send({ error: errorObj })
      return
    }

    const targetCollection = pulseRawDb.collection(collectionName)

    await targetCollection.deleteMany()
    await targetCollection.insertMany(data)

    const persistedData = await targetCollection.find().toArray()

    res.json(persistedData)
  })
})

module.exports = subApp
