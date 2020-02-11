const { gql } = require('apollo-server-express')

const updateQualityOfAccessScoreTypeDefs = gql`
  input UpdateQualityOfAccessScoreInput {
    _id: ID!
    access: String!
    accessTiny: String!
    score: String!
    sortOrder: String!
    color: String!
    caption: JSON!
  }

  type UpdateQualityOfAccessScorePayload {
    _id: ID
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    caption: JSON
  }
`

module.exports = updateQualityOfAccessScoreTypeDefs
