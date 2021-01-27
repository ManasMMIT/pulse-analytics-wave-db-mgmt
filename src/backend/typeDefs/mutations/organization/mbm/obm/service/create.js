const { gql } = require('apollo-server-express')

const createObmServiceTypeDefs = gql`
  input CreateObmServiceInput {
    name: String!
    description: String
  }

  type CreateObmServicePayload {
    id: ID!
    name: String!
    description: String
  }
`

module.exports = createObmServiceTypeDefs
