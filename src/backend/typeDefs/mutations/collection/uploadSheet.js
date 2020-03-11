const { gql } = require('apollo-server-express')

const uploadSheetTypeDef = gql`
  input UploadSheetInput {
    data: JSON!
    wb: String!
    sheet: String!
    timestamp: DateTime
    projectId: ID
  }
`

module.exports = uploadSheetTypeDef
