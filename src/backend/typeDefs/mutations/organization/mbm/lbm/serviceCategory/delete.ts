import { gql } from 'apollo-server-express'

const deleteLbmServiceCategoryTypeDefs = gql`
  input DeleteLbmServiceCategoryInput {
    _id: ID!
  }

  type DeleteLbmServiceCategoryPayload {
    _id: ID
    name: String
  }
`

export default deleteLbmServiceCategoryTypeDefs
