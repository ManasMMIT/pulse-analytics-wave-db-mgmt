const { gql } = require('apollo-server-express')

const updateObmTypeTypeDefs = gql`
  input UpdateObmTypeInput {
    _id: ID!
    name: String!
    description: String
  }

  type UpdateObmTypePayload {
    _id: ID!
    name: String!
    description: String
  }
`

module.exports = updateObmTypeTypeDefs
