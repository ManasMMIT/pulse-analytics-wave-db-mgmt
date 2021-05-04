const { gql } = require('apollo-server-express')

const updateSourceProductTypeDefs = gql`
  input UpdateSourceProductInput {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
    uuid: String
  }

  type UpdateSourceProductPayload {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
    uuid: String
  }
`

module.exports = updateSourceProductTypeDefs
