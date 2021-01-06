import { gql } from 'apollo-server-express'

const connectLbmServiceAndLbmServiceCategoryTypeDefs = gql`
  input ConnectLbmServiceAndLbmServiceCategoryInput {
    _id: ID
    lbmServiceId: String!
    lbmServiceCategoryId: String!
  }

  type ConnectLbmServiceAndLbmServiceCategoryPayload {
    _id: ID!
    lbmServiceId: String!
    lbmServiceCategoryId: String!
  }
`

export default connectLbmServiceAndLbmServiceCategoryTypeDefs
