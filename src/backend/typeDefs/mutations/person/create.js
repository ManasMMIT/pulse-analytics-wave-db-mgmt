const { gql } = require('apollo-server-express')

const createPersonTypeDefs = gql`
  input CreatePersonInput {
    _id: ID # included but should always be null
    name: String!
    nationalProviderIdentifier: Int
  }

  type CreatePersonPayload {
    _id: ID
    name: String
    nationalProviderIdentifier: Int
  }
`

module.exports = createPersonTypeDefs
