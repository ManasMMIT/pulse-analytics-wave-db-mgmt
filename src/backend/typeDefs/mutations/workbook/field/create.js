const { gql } = require('apollo-server-express')

const createSheetFieldTypeDefs = gql`
  input CreateSheetFieldInput {
    workbookId: ID!
    sheetId: ID!
    name: String!
    type: String!
    oneOf: String
    businessObjRef: BusinessObjRefInput
  }

  input BusinessObjRefInput {
    _id: ID!
    fieldId: ID!
    allowBlankValues: Boolean
  }
`

module.exports = createSheetFieldTypeDefs
