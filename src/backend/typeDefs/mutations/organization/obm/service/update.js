const { gql } = require('apollo-server-express')

const updateObmServiceTypeDefs = gql`
  input UpdateObmServiceInput {
    _id: ID!
    name: String!
    description: String
  }

  type UpdateObmServicePayload {
    _id: ID!
    name: String!
    description: String
  }
`

module.exports = updateObmServiceTypeDefs
