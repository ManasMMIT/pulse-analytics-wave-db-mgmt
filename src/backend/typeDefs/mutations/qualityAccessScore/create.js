const { gql } = require('apollo-server-express')

const createQualityAccessScoreTypeDefs = gql`
  input CreateQualityAccessScoreInput {
    _id: ID!
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    relevance: String
    caption: JSON
  }

  type CreateQualityAccessScorePayload {
    _id: ID!
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    relevance: String
    caption: JSON
  }
`

module.exports = createQualityAccessScoreTypeDefs
