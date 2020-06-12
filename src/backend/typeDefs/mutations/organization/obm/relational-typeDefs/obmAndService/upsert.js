const { gql } = require('apollo-server-express')

const connectObmAndObmServiceTypeDefs = gql`
  input ConnectObmAndObmServiceInput {
    _id: ID
    obmServiceId: String!
    obmId: String!
    rating: Int!
  }

  type ConnectObmAndObmServicePayload {
    _id: ID!
    obmServiceId: String!
    obmId: String!
    rating: Int!
  }
`

module.exports = connectObmAndObmServiceTypeDefs
