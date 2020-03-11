const { gql } = require('apollo-server-express')

const createSheetTypeDefs = gql`
  input CreateSheetInput {
    workbookId: ID!
    name: String!
    collection: String
  }
`

module.exports = createSheetTypeDefs
