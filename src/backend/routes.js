require('dotenv').load()
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const GraphQLJSON = require('graphql-type-json')
const _ = require('lodash')

const generateSitemaps = require('./generate-sitemaps')

const typeDefs = gql`
  scalar JSON

  type Query {
    nodes(parentId: String, type: String): [Node]
    clients(_id: String): [Client]
    teams(clientId: String): [Team]
    teamUsers(teamId: String): [User]
    userTeams(userId: String): [Team]
    indications: [Indication]
  }

  type Mutation {
    updateRoleSitemap(input: UpdateRoleSitemapInput!): UpdateRoleSitemapPayload
    pushSitemapToDev: String
    pushSitemapToProd: String
    createIndication(input: CreateIndicationInput!): CreateIndicationPayload
  }

  input UpdateRoleSitemapInput {
    teamId: String!
    updatedSitemap: UpdatedSitemapInput!
  }

  input UpdatedSitemapInput {
    tools: [NodeInput]
    dashboards: [NodeInput]
    pages: [NodeInput]
    cards: [NodeInput]
  }

  type UpdateRoleSitemapPayload {
    tools: [Node]
    dashboards: [Node]
    pages: [Node]
    cards: [Node]
  }

  input CreateIndicationInput {
    name: String!
  }

  type CreateIndicationPayload {
    _id: ID
    name: String
  }

  # need to create NodeInput of type Input, otherwise server fails:
  # https://stackoverflow.com/questions/52139654/how-to-deal-with-nested-input-in-graphql
  input NodeInput {
    _id: ID
    name: String
    type: String
    componentPath: String
    text: JSON
    subtitle: String
    caption: String
    order: Int
    parentId: String
    schemaVersion: String
    resources: JSON
    icon: String # TODO: deprecate and change to iconId
  }

  type Node {
    _id: ID!
    name: String
    type: String
    componentPath: String
    text: JSON
    subtitle: String
    caption: String
    order: Int
    parentId: String
    schemaVersion: String
    resources: JSON
    icon: String # TODO: deprecate and change to iconId
  }

  type Client {
    _id: String
    name: String
    description: String
  }

  type Team {
    _id: String!
    name: String!
    description: String!
    isDefault: Boolean
    sitemap: JSON
  }

  type User {
    _id: String
    username: String
    email: String
  }

  type Indication {
    _id: ID!
    name: String
  }
`

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    nodes: (parent, { parentId, type }, { pulseCoreDb }, info) => {
      let queryObj = {}
      if (parentId) queryObj.parentId = parentId
      if (type) queryObj.type = type

      return pulseCoreDb.collection('nodes')
        .find(queryObj)
        .sort({ order: 1 })
        .toArray()
    },
    clients: async (parent, { _id }, { pulseCoreDb } ) => {
      const queryObj = Boolean(_id) ? { _id } : {}
      let clients = await pulseCoreDb
        .collection('clients')
        .find(queryObj)
        .toArray()

      clients = _.sortBy(
        clients,
        ({ description }) => description.toLowerCase()
      )
      return clients
    },
    teams: async (parent, { clientId }, { pulseCoreDb }) => {
      const queryObj = Boolean(clientId)
        ? { 'client._id': clientId }
        : {}

      const clientRoles = await pulseCoreDb
        .collection('roles')
        .find(queryObj)
        .toArray()

      const [[adminRole], restOfRoles] = _.partition(
        clientRoles,
        ({ name }) => name.includes('-admin')
      )

      if (adminRole) {
        adminRole.isDefault = true
      }

      const sortedOtherRoles = _.sortBy(
        restOfRoles,
        ({ description }) => description.toLowerCase()
      )

      const result = _.compact([adminRole, ...sortedOtherRoles])

      return result
    },
    userTeams: async (parent, { userId }, { pulseCoreDb }) => {
      const userTeams = await pulseCoreDb.collection('roles')
        .find({ 'users._id': userId })
        .toArray()

      const result = _.sortBy(
        userTeams,
        ({ description }) => description.toLowerCase()
      )

      return result
    },
    teamUsers: async (parent, { teamId }, { pulseCoreDb }) => {
      const {
        users: usersAssociatedWithRole
      } = await pulseCoreDb.collection('roles')
        .findOne({ _id: teamId })

      const result = _.sortBy(
        usersAssociatedWithRole,
        ({ username }) => username.toLowerCase()
      )

      return result
    },
    indications: (parent, args, { pulseCoreDb }, info) => {
      return pulseCoreDb.collection('indications').find().toArray()
    },
  },
  Mutation: {
    updateRoleSitemap: (parent, { input: { teamId, updatedSitemap } }, { pulseCoreDb }, info) => {
      return pulseCoreDb.collection('roles')
        .findOneAndUpdate(
          { _id: teamId },
          { $set: { sitemap: updatedSitemap } },
          { returnOriginal: false }
        )
        .then(({ value }) => value.sitemap)
    },
    pushSitemapToDev: async (parent, args, context, info) => {
      const { mongoClient, pulseCoreDb, pulseDevDb } = context

      await generateSitemaps({
        mongoClient,
        pulseCoreDb,
        pulseDevDb,
      })

      return 'Sitemap push to dev successful'
    },
    pushSitemapToProd: async (parent, args, context, info) => {
      const { mongoClient, pulseDevDb, pulseProdDb } = context

      const session = mongoClient.startSession()

      await session.withTransaction(async () => {
        const usersSitemapsDev = await pulseDevDb.collection('users.sitemaps')
          .find({}, { session }).toArray()

        await pulseProdDb.collection('users.sitemaps')
          .deleteMany({}, { session })

        await pulseProdDb.collection('users.sitemaps')
          .insertMany(usersSitemapsDev, { session })
      })

      return 'Sitemap push to prod successful'
    },
    createIndication: (parent, { input: { name } }, { pulseCoreDb }, info) => {
      return pulseCoreDb.collection('indications').insertOne({ name })
        .then(res => res.ops[0])
    },
  }
};

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
