const { gql } = require('apollo-server-express')

const upsertObmAndPayerConnectionTypeDefs = gql`
  input UpsertObmAndPayerConnectionInput {
    _id: ID
    payerId: String!
    obmId: String!
    note: String
    books: [ObmAndPayerConnectionBookObjInput!]!
  }

  input ObmAndPayerConnectionBookObjInput {
    _id: String!
    name: String!
    isNational: Boolean!
    states: [String!]!
  }
`

module.exports = upsertObmAndPayerConnectionTypeDefs
