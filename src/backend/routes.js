require('dotenv').load()
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

  subApp.post('/upload', async (req, res) => {
    const targetCollection = pulseRawDb.collection(req.body.collectionName)

    await targetCollection.deleteMany()
    await targetCollection.insertMany(req.body.data)

    const persistedData = await targetCollection.find().toArray()

    res.json(persistedData)
  })
})


module.exports = subApp
