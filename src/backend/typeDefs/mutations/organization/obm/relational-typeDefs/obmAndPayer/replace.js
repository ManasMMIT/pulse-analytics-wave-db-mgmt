const { gql } = require('apollo-server-express')

const connectObmAndPayerTypeDefs = gql`
  input ConnectObmAndPayerInput {
    obmId: ID!
    connections: [ObmConnectionToPayer!]!
  }

  input ObmConnectionToPayer {
    _id: ID!
    payerId: String!
  }

  type ConnectObmAndPayerPayload {
    _id: ID!
    payerId: String!
    obmId: String!
  }
`

module.exports = connectObmAndPayerTypeDefs
