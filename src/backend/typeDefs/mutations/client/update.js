const { gql } = require('apollo-server-express')

const updateClientTypeDefs = gql`
  input UpdateClientInput {
    _id: ID!
    description: String!
    icon: String
  }

  type UpdateClientPayload {
    _id: ID!
    name: String
    description: String
    icon: String
  }
`

module.exports = updateClientTypeDefs
