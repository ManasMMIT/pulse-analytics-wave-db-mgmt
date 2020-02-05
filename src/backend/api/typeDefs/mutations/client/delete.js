const { gql } = require('apollo-server-express')

const deleteClientTypeDefs = gql`
  input DeleteClientInput {
    _id: ID!
  }

  type DeleteClientPayload {
    _id: ID!
    name: String
    description: String
  }
`

module.exports = deleteClientTypeDefs
