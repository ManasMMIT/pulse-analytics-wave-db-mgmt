const { gql } = require('apollo-server-express')

const importWorkbookTypeDef = gql`
  input ImportWorkbookInput {
    data: JSON!
    wb: String!
    sheet: String!
    timestamp: String # purposely String so short ISO string gets to backend and can be made UTC equivalent of NY time
    projectId: ID
  }
`

module.exports = importWorkbookTypeDef
