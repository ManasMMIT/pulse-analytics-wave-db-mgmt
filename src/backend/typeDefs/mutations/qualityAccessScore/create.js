const { gql } = require('apollo-server-express')

const createQualityOfAccessScoreTypeDefs = gql`
  input CreateQualityOfAccessScoreInput {
    access: String!
    accessTiny: String!
    score: String!
    sortOrder: String!
    color: String!
    relevance: String!
    caption: String!
  }

  type CreateQualityOfAccessScorePayload {
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

module.exports = createQualityOfAccessScoreTypeDefs
