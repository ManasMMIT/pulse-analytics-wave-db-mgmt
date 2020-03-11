const { gql } = require('apollo-server-express')

const createProductTypeDefs = gql`
  input CreateProductInput {
    _id: ID # included but should always be null
    nameGeneric: String
    nameBrand: String
    tags: [String]
  }

  type CreateProductPayload {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
  }
`

module.exports = createProductTypeDefs
