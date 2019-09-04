const { gql } = require('apollo-server-express')

const deleteSourceProductTypeDefs = gql`
  input DeleteSourceProductInput {
    _id: ID!
  }

  type DeleteSourceProductPayload {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
  }
`

module.exports = deleteSourceProductTypeDefs
