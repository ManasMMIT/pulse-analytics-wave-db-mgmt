const { gql } = require('apollo-server-express')

const updateLineTypeDefs = gql`
  input UpdateLineInput {
    _id: String!
    name: String!
  }

  type UpdateLinePayload {
    _id: ID
    name: String
  }
`

module.exports = updateLineTypeDefs
