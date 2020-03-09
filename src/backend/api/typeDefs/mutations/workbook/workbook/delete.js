const { gql } = require('apollo-server-express')

const deleteWorkbookTypeDefs = gql`
  input DeleteWorkbookInput {
    _id: ID!
  }

  type DeleteWorkbookPayload {
    _id: ID!
    name: String!
    sheets: [Sheet]!
  }
`

module.exports = deleteWorkbookTypeDefs
