const { gql } = require('apollo-server-express')

const createClientTypeDefs = gql`
  input CreateClientInput {
    description: String!
  }

  type CreateClientPayload {
    _id: ID!
    name: String
    description: String
  }
`

module.exports = createClientTypeDefs
