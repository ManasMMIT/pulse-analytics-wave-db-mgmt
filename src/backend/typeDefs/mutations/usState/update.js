const { gql } = require('apollo-server-express')

const updateUsStateTypeDefs = gql`
  input UpdateUsStateInput {
    _id: ID
    state: String!
    stateLong: String!
    status: String
    booksImpacted: [String]
    law: String
    lawLink: String
    bill: String
    surveyCommercialLivesPercentInsured: Float
  }

  type UpdateUsStatePayload {
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

module.exports = updateUsStateTypeDefs
