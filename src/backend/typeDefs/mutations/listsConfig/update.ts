const { gql } = require('apollo-server-express')

const updateListsConfigTypeDefs = gql`

  input UpdateListsConfigMetaInput {
    location: String
    note: String
    type: String
  }

  input UpdateListsConfigLabelKeysInput {
    labelKey: String!
    labelName: String
    labelInfo: String
    valueWrapperType: String
  }

  input UpdateListsConfigInput {
    _id: ID!
    listId: String
    nodeId: ID
    listTitle: String
    listInfo: String
    meta: UpdateListsConfigMetaInput
    dashboardTool: String
    labelKeys: [UpdateListsConfigLabelKeysInput]
  }
`

export default updateListsConfigTypeDefs
