const { gql } = require('apollo-server-express')

const updatePersonTypeDefs = gql`
  input UpdatePersonInput {
    _id: ID!
    firstName: String!
    lastName: String!
    nationalProviderIdentifier: Int
  }

  type UpdatePersonPayload {
    _id: ID!
    createdOn: DateTime
    updatedOn: DateTime
    firstName: String
    lastName: String
    nationalProviderIdentifier: Int
  }
`

module.exports = updatePersonTypeDefs
