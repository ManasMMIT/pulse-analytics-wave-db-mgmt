const { gql } = require('apollo-server-express')

const createListsConfigTypeDefs = gql`
  input CreateListsConfigMetaInput {
    location: String
    note: String
    type: String
  }

  input CreateListsConfigInput {
    listId: String!
    nodeId: ID
    listTitle: String
    listInfo: String
    meta: CreateListsConfigMetaInput
    dashboardTool: String!
  }
`

export default createListsConfigTypeDefs
