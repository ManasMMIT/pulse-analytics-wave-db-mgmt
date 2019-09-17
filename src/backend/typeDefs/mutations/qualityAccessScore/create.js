const { gql } = require('apollo-server-express')

const createQualityAccessScoreTypeDefs = gql`
  input CreateQualityAccessScoreInput {
    access: String
    accessTiny: String
    score: String
    sortOrder: String
    color: String
    relevance: String
    caption: String
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
