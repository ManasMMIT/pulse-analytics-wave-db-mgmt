const { gql } = require('apollo-server-express')

const pushDevToProdTypeDefs = gql`
  input PushDevToProdInput {
    _id: ID
    isPushAll: Boolean
    name: String!
  }
`

module.exports = pushDevToProdTypeDefs
