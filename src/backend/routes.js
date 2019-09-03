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
})


module.exports = subApp
