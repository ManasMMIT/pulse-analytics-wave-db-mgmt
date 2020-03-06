const { gql } = require('apollo-server-express')

const updateSheetFieldTypeDefs = gql`
  input UpdateSheetFieldInput {
    workbookId: ID!
    sheetId: ID!
    fieldId: ID!
    name: String!
    type: String!
    oneOf: [String]
  }
`

module.exports = updateSheetFieldTypeDefs
