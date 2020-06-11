const { gql } = require('apollo-server-express')

const connectObmServiceAndObmServiceCategoryTypeDefs = gql`
  input ConnectObmServiceAndObmServiceCategoryInput {
    _id: ID
    obmServiceId: String!
    obmServiceCategoryId: String!
  }

  type ConnectObmServiceAndObmServiceCategoryPayload {
    _id: ID!
    obmServiceId: String!
    obmServiceCategoryId: String!
  }
`

module.exports = connectObmServiceAndObmServiceCategoryTypeDefs
