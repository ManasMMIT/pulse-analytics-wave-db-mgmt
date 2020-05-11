const { gql } = require('apollo-server-express')

const updateCoverageTypeDefs = gql`
  input UpdateCoverageInput {
    _id: String!
    name: String!
  }

  type UpdateCoveragePayload {
    _id: ID
    name: String
  }
`

module.exports = updateCoverageTypeDefs
