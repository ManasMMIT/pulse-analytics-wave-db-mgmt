const { gql } = require('apollo-server-express')

const createObmServiceCategoryTypeDefs = gql`
  input CreateObmServiceCategoryInput {
    name: String!
  }

  type CreateObmServiceCategoryPayload {
    _id: ID!
    name: String!
  }
`

module.exports = createObmServiceCategoryTypeDefs
