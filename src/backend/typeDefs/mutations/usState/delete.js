const { gql } = require('apollo-server-express')

const deleteUsStateTypeDefs = gql`
  input DeleteUsStateInput {
    _id: ID!
  }

  type DeleteUsStatePayload {
    _id: ID!
    state: String
    stateLong: String
    status: String
    booksImpacted: [String]
    law: String
    lawLink: String
    bill: String
    surveyCommercialLivesPercentInsured: Float
  }
`

module.exports = deleteUsStateTypeDefs
