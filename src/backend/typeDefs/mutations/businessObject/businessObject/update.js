const { gql } = require('apollo-server-express')

const updateBusinessObjectTypeDefs = gql`
  input UpdateBusinessObjectInput {
    _id: ID!
    name: String!
    sourceCollection: String
  }
`

module.exports = updateBusinessObjectTypeDefs
