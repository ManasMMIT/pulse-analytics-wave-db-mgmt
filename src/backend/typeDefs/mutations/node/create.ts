import { gql } from 'apollo-server-express'

const createNodeTypeDefs = gql`
  input CreateNodeInput {
    name: String!
    type: String!
    componentPath: String
    text: JSON!
    subtitle: String
    caption: String
    order: Int
    parentId: String
    schemaVersion: String
    icon: String # TODO: deprecate and change to iconId
  }
`

export default createNodeTypeDefs
