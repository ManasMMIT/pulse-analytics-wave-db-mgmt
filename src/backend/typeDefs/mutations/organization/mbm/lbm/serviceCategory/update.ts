import { gql } from 'apollo-server-express'

const updateLbmServiceCategoryTypeDefs = gql`
  input UpdateLbmServiceCategoryInput {
    _id: ID!
    name: String!
  }

  type UpdateLbmServiceCategoryPayload {
    _id: ID!
    name: String!
  }
`

export default updateLbmServiceCategoryTypeDefs
