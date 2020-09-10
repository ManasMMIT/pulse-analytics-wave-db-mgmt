const { gql } = require('apollo-server-express')

const updateDevToProdPushConfig = gql`
  input UpdateDevToProdPushConfigInput {
    _id: ID!
    name: String
    collections: [String!]!
  }
`

module.exports = updateDevToProdPushConfig
