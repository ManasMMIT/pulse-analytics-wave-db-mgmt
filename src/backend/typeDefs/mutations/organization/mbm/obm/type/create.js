const { gql } = require('apollo-server-express')

const createObmTypeTypeDefs = gql`
  input CreateObmTypeInput {
    name: String!
    description: String
  }

  type CreateObmTypePayload {
    _id: ID!
    name: String!
    description: String
  }
`

module.exports = createObmTypeTypeDefs
