const { gql } = require('apollo-server-express')

const updateWorkbookTypeDefs = gql`
  input UpdateWorkbookInput {
    _id: ID!
    name: String!
  }

  type UpdateWorkbookPayload {
    _id: ID!
    name: String!
    sheets: [Sheet]!
  }
`

module.exports = updateWorkbookTypeDefs
