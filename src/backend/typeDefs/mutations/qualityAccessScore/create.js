const { gql } = require('apollo-server-express')

const createQualityOfAccessScoreTypeDefs = gql`
  input CreateQualityOfAccessScoreInput {
    access: String!
    accessTiny: String!
    score: Int!
    sortOrder: Int!
    color: String!
    caption: JSON!
  }

  type CreateQualityOfAccessScorePayload {
    _id: ID!
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    caption: JSON
  }
`

module.exports = createQualityOfAccessScoreTypeDefs
