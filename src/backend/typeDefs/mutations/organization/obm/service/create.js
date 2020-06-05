const { gql } = require('apollo-server-express')

const createObmServiceTypeDefs = gql`
  input CreateObmServiceInput {
    name: String!
  }

  type CreateObmServicePayload {
    _id: ID!
    name: String!
  }
`

module.exports = createObmServiceTypeDefs
