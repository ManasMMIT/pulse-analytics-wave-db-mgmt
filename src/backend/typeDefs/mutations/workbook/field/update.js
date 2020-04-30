const { gql } = require('apollo-server-express')

const updateSheetFieldTypeDefs = gql`
  input UpdateSheetFieldInput {
    workbookId: ID!
    sheetId: ID!
    fieldId: ID!
    name: String!
    type: String!
    oneOf: String
    businessObjRef: BusinessObjRefInput # this typeDef initialized in createSheetFieldTypeDefs
  }
`

module.exports = updateSheetFieldTypeDefs
