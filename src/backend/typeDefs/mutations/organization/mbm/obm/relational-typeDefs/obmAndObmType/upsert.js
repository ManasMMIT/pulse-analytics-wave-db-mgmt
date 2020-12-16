const { gql } = require('apollo-server-express')

const connectObmAndObmTypeTypeDefs = gql`
  input ConnectObmAndObmTypeInput {
    _id: ID
    obmId: String!
    obmTypeId: String!
  }

  type ConnectObmAndObmTypePayload {
    _id: ID!
    obmId: String!
    obmTypeId: String!
  }
`

module.exports = connectObmAndObmTypeTypeDefs
