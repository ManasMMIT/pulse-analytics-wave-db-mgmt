require('dotenv').load()
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const GraphQLJSON = require('graphql-type-json')

const typeDefs = gql`
  scalar JSON

  type Query {
    nodes(parentId: String, type: String): [Node]
    indications: [Indication]
  }

  type Mutation {
    updateRoleSitemap(input: UpdateRoleSitemapInput!): UpdateRoleSitemapPayload
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
    icon: String # TODO: deprecate and change to iconId
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
    indications: (parent, args, { pulseCoreDb }, info) => {
      return pulseCoreDb.collection('indications').find().toArray()
    }
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
  getSitemapController,
  getNodeController,
} = require('./controllers')

const MongoClient = require('mongodb').MongoClient

const auth0 = require('./auth0')

const {
  sequelize,
  models: {
    User,
    Role,
    Client,
    Node,
    RoleNode,
    RegionalBreakdown,
    Resource,
  },
} = require('./sequelize')

const subApp = express()

MongoClient.connect(process.env.LOADER_URI, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const mongoClient = client
  const pulseDevDb = client.db('pulse-dev')
  const pulseCoreDb = client.db('pulse-core')
  const pulseProdDb = client.db('pulse-prod')

  const mongoUsers = pulseCoreDb.collection('users')
  const mongoRoles = pulseCoreDb.collection('roles')
  const mongoNodes = pulseCoreDb.collection('nodes')
  const mongoClients = pulseCoreDb.collection('clients')

  console.log(`Connected to MongoDB: ${process.env.LOADER_URI}`)

  const voltronDBsConfig = {
    // Head Lion
    auth0,

    // Arm Lions
    mongoClient,
    pulseDevDb,
    pulseCoreDb,
    pulseProdDb,

    mongoUsers,
    mongoRoles,
    mongoClients,
    mongoNodes,

    // Leg Lions
    sequelize,

    User,
    Role,
    Client,
    Node,
    RoleNode,
    RegionalBreakdown,
    Resource,
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => voltronDBsConfig,
  })

  apolloServer.applyMiddleware({ app: subApp })

  const clientController = getClientController(voltronDBsConfig)
  const roleController = getRoleController(voltronDBsConfig)
  const userController = getUserController(voltronDBsConfig)
  const sitemapController = getSitemapController(voltronDBsConfig)
  const nodeController = getNodeController(voltronDBsConfig)

  subApp.use('/clients', clientController)
  subApp.use('/roles', roleController)
  subApp.use('/users', userController)
  subApp.use('/sitemaps', sitemapController)
  subApp.use('/nodes', nodeController)
})


module.exports = subApp
