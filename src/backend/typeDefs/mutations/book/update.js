const { gql } = require('apollo-server-express')

const updateBookTypeDefs = gql`
  input UpdateBookInput {
    _id: String!
    name: String!
  }

  type UpdateBookPayload {
    _id: ID
    name: String
  }
`

module.exports = updateBookTypeDefs
