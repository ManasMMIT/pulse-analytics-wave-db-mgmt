const { gql } = require('apollo-server-express')

const deletePersonTypeDefs = gql`
  input DeletePersonInput {
    _id: ID!
  }

  type DeletePersonPayload {
    _id: ID
    name: String
    nationalProviderIdentifier: Float
  }
`

module.exports = deletePersonTypeDefs
