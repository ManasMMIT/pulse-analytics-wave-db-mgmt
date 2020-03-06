const { gql } = require('apollo-server-express')

const createSheetTypeDefs = gql`
  input CreateSheetInput {
    workbookId: ID!
    name: String!
  }
`

module.exports = createSheetTypeDefs
