const { gql } = require('apollo-server-express')

const createCoverageTypeDefs = gql`
  input CreateCoverageInput {
    _id: ID # included but should always be null
    name: String!
  }

  type CreateCoveragePayload {
    _id: ID
    name: String
  }
`

module.exports = createCoverageTypeDefs
