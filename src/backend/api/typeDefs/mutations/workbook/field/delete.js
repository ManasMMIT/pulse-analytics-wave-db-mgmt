const { gql } = require('apollo-server-express')

const deleteSheetFieldTypeDefs = gql`
  input DeleteSheetFieldInput {
    workbookId: ID!
    sheetId: ID!
    fieldId: ID!
  }
`

module.exports = deleteSheetFieldTypeDefs
