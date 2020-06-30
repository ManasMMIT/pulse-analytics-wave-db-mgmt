const { gql } = require('apollo-server-express')

const createPersonTypeDefs = gql`
  input CreatePersonInput {
    _id: ID # included but should always be null
    firstName: String!
    lastName: String!
    nationalProviderIdentifier: Int
  }

  type CreatePersonPayload {
    _id: ID
    firstName: String
    lastName: String
    nationalProviderIdentifier: Int
  }
`

module.exports = createPersonTypeDefs
