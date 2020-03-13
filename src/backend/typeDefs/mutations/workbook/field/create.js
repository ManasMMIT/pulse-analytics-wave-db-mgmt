const { gql } = require('apollo-server-express')

const createSheetFieldTypeDefs = gql`
  input CreateSheetFieldInput {
    workbookId: ID!
    sheetId: ID!
    name: String!
    type: String!
    oneOf: String
  }
`

module.exports = createSheetFieldTypeDefs
