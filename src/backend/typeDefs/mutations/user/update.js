const { gql } = require('apollo-server-express')

const updateUserTypeDefs = gql`
  input UpdateUserInput {
    _id: ID!
    username: String
    email: String
    password: String
    roles: [ID!]!
  }

  type UpdateUserPayload {
    _id: ID!
    username: String
    email: String
    password: String
  }
`

module.exports = updateUserTypeDefs
