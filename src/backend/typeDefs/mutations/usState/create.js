const { gql } = require('apollo-server-express')

const createUsStateTypeDefs = gql`
  input CreateUsStateInput {
    _id: ID # included but should always be null
    state: String!
    stateLong: String!
    status: String
    booksImpacted: [String]
    law: String
    lawLink: String
    bill: String
    surveyCommercialLivesPercentInsured: Float
  }

  type CreateUsStatePayload {
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

module.exports = createUsStateTypeDefs
