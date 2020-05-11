const { gql } = require('apollo-server-express')

const deleteBookTypeDefs = gql`
  input DeleteBookInput {
    _id: ID!
  }

  type DeleteBookPayload {
    _id: ID
    name: String
  }
`

module.exports = deleteBookTypeDefs
