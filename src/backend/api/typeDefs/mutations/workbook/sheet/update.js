const { gql } = require('apollo-server-express')

const updateSheetTypeDefs = gql`
  input UpdateSheetInput {
    workbookId: ID!
    sheetId: ID!
    name: String!
    collection: String
  }
`

module.exports = updateSheetTypeDefs
