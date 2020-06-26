const { gql } = require('apollo-server-express')

const updatePersonTypeDefs = gql`
  input UpdatePersonInput {
    _id: ID!
    name: String!
    nationalProviderIdentifier: Int
  }

  type UpdatePersonPayload {
    _id: ID!
    name: String!
    nationalProviderIdentifier: Int
  }
`

module.exports = updatePersonTypeDefs
