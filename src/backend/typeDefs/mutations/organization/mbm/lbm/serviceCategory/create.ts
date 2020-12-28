import { gql } from 'apollo-server-express'

const createLbmServiceCategoryTypeDefs = gql`
  input CreateLbmServiceCategoryInput {
    name: String!
  }

  type CreateLbmServiceCategoryPayload {
    _id: ID!
    name: String!
  }
`

export default createLbmServiceCategoryTypeDefs
