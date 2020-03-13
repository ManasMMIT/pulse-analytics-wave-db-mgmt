const { gql } = require('apollo-server-express')

const deleteSheetTypeDefs = gql`
  input DeleteSheetInput {
    workbookId: ID!
    sheetId: ID!
  }
`

module.exports = deleteSheetTypeDefs
