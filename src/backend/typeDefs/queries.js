const { gql } = require('apollo-server-express')

const queries = gql`
  type Query {
    nodes(parentId: String, type: String): [Node]
    clients(_id: String): [Client]
    teams(clientId: String, userId: String): [Team]
    users(teamId: String, clientId: String): [User]
    indications: [Indication]
    products: [Product]
    regimens: [Regimen]
    accounts(type: String): [Account]
    qualityOfAccessScores: [QualityOfAccessScore]
    collections(type: String): [String]
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
    client: Client
  }

  type User {
    _id: String
    username: String
    email: String
  }

  type Indication {
    _id: ID!
    name: String
    regimens: [Regimen]
  }

  type Product {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
  }

  type Regimen {
    _id: ID!
    name: String!
    products: [Product!]!
  }

  type QualityOfAccessScore {
    _id: ID!
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    relevance: String
    caption: JSON
  }

  type Account {
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    providerCancerCenter: String # TODO: Change to just cancerCenter or create separate tool account typedefs
  }
`

module.exports = [
  queries,
]
