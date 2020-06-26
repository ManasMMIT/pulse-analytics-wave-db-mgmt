const { gql } = require('apollo-server-express')

const deleteObmServiceCategoryTypeDefs = gql`
  input DeleteObmServiceCategoryInput {
    _id: ID!
  }

  type DeleteObmServiceCategoryPayload {
    _id: ID
    name: String
  }
`

module.exports = deleteObmServiceCategoryTypeDefs
