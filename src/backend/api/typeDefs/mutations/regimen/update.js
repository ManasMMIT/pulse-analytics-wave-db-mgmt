const { gql } = require('apollo-server-express')

const updateSourceRegimenTypeDefs = gql`
  input UpdateSourceRegimenInput {
    _id: ID!
    name: String!
    products: [UpdateRegimenProductInput!]!
  }

  input UpdateRegimenProductInput {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
  }

  type UpdateSourceRegimenPayload {
    _id: ID!
    name: String!
    products: [Product!]!
  }
`

module.exports = updateSourceRegimenTypeDefs
