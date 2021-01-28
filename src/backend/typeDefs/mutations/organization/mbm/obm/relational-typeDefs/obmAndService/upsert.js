const { gql } = require('apollo-server-express')

const connectObmAndObmServiceTypeDefs = gql`
  input ConnectObmAndObmServiceInput {
    id: ID
    obmServiceId: String!
    obmId: String!
    rating: Int!
  }

  type ConnectObmAndObmServicePayload {
    id: ID!
    obmServiceId: String!
    obmId: String!
    rating: Int!
  }
`

module.exports = connectObmAndObmServiceTypeDefs
