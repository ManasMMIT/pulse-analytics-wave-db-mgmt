const { gql } = require('apollo-server-express')

const createRegimenTypeDefs = gql`
  input CreateRegimenInput {
    _id: ID # allowed to be included but should always be null
    name: String!
    products: [CreateRegimenProductInput!]! # both array and items in array are non-nullable https://graphql.org/learn/schema/#type-system
  }

  input CreateRegimenProductInput {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    uuid: String!
    tags: [String]
  }

  type CreateRegimenPayload {
    _id: ID!
    name: String!
    uuid: String
    products: [Product!]!
  }
`

module.exports = createRegimenTypeDefs
