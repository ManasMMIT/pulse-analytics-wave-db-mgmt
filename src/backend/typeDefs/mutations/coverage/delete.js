const { gql } = require('apollo-server-express')

const deleteCoverageTypeDefs = gql`
  input DeleteCoverageInput {
    _id: ID!
  }

  type DeleteCoveragePayload {
    _id: ID
    name: String
  }
`

module.exports = deleteCoverageTypeDefs
