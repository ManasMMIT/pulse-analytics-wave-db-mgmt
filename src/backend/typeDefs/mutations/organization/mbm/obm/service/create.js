const { gql } = require('apollo-server-express')

const createObmServiceTypeDefs = gql`
  input CreateObmServiceInput {
    name: String!
    description: String
  }

  type CreateObmServicePayload {
    _id: ID!
    name: String!
    description: String
  }
`

module.exports = createObmServiceTypeDefs
