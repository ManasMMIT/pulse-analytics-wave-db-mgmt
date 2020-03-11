const { gql } = require('apollo-server-express')

const createWorkbookTypeDefs = gql`
  input CreateWorkbookInput {
    name: String!
  }

  type CreateWorkbookPayload {
    _id: ID!
    name: String!
    sheets: [Sheet]
  }
`

module.exports = createWorkbookTypeDefs
