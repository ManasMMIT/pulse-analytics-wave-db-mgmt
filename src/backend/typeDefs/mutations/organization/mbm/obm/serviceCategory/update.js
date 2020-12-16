const { gql } = require('apollo-server-express')

const updateObmServiceCategoryTypeDefs = gql`
  input UpdateObmServiceCategoryInput {
    _id: ID!
    name: String!
  }

  type UpdateObmServiceCategoryPayload {
    _id: ID!
    name: String!
  }
`

module.exports = updateObmServiceCategoryTypeDefs
