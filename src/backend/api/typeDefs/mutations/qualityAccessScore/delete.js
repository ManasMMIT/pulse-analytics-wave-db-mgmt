const { gql } = require('apollo-server-express')

const deleteQualityOfAccessScoreTypeDefs = gql`
  input DeleteQualityOfAccessScoreInput {
    _id: ID!
  }

  type DeleteQualityOfAccessScorePayload {
    _id: ID!
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    caption: JSON
  }
`

module.exports = deleteQualityOfAccessScoreTypeDefs
