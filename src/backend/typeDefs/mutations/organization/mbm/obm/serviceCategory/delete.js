const { gql } = require('apollo-server-express')

const deleteObmServiceCategoryTypeDefs = gql`
  input DeleteObmServiceCategoryInput {
    id: ID!
  }

  type DeleteObmServiceCategoryPayload {
    id: ID
    name: String
  }
`

module.exports = deleteObmServiceCategoryTypeDefs
