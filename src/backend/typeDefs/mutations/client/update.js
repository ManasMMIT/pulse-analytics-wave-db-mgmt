const { gql } = require('apollo-server-express')

const updateClientTypeDefs = gql`
  input UpdateClientInput {
    _id: ID!
    description: String!
  }

  type UpdateClientPayload {
    _id: ID!
    name: String
    description: String
  }
`

module.exports = updateClientTypeDefs
