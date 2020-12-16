const { gql } = require('apollo-server-express')

const connectObmAndPersonTypeDefs = gql`
  input ConnectObmAndPersonInput {
    _id: ID
    personId: String!
    obmId: String!
    position: String
    managementTypes: [String!]!
  }

  type ConnectObmAndPersonPayload {
    _id: ID!
    personId: String!
    obmId: String!
    position: String
    managementTypes: [String!]!
  }
`

module.exports = connectObmAndPersonTypeDefs
