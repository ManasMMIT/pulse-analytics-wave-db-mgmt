const { gql } = require('apollo-server-express')

const createLineTypeDefs = gql`
  input CreateLineInput {
    _id: ID # included but should always be null
    name: String!
  }

  type CreateLinePayload {
    _id: ID
    name: String
  }
`

module.exports = createLineTypeDefs
