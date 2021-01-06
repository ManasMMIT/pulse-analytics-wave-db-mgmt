import { gql } from 'apollo-server-express'

const updateNodeTypeDefs = gql`
  input UpdateNodeInput {
    node: UpdateNode
    cascade: Boolean
  }

  input UpdateNode {
    _id: ID!
    name: String
    type: String
    componentPath: String
    text: JSON
    subtitle: String
    caption: String
    order: Int
    parentId: String
    schemaVersion: String
    icon: String # TODO: deprecate and change to iconId
  }
`

export default updateNodeTypeDefs
