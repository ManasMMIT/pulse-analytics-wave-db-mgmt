const { gql } = require('apollo-server-express')

const createBookTypeDefs = gql`
  input CreateBookInput {
    _id: ID # included but should always be null
    name: String!
  }

  type CreateBookPayload {
    _id: ID
    name: String
  }
`

module.exports = createBookTypeDefs
