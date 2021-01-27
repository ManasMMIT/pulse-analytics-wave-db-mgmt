const { gql } = require('apollo-server-express')

const updateObmServiceCategoryTypeDefs = gql`
  input UpdateObmServiceCategoryInput {
    id: ID!
    name: String!
  }

  type UpdateObmServiceCategoryPayload {
    id: ID!
    name: String!
  }
`

module.exports = updateObmServiceCategoryTypeDefs
