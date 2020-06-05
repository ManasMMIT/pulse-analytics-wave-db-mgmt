const { gql } = require('apollo-server-express')

const updateObmServiceTypeDefs = gql`
  input UpdateObmServiceInput {
    _id: ID!
    name: String!
  }

  type UpdateObmServicePayload {
    _id: ID!
    name: String!
  }
`

module.exports = updateObmServiceTypeDefs
