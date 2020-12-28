import { gql } from 'apollo-server-express'

const connectLbmAndLbmServiceTypeDefs = gql`
  input ConnectLbmAndLbmServiceInput {
    _id: ID
    lbmServiceId: String!
    lbmId: String!
    rating: Int!
  }

  type ConnectLbmAndLbmServicePayload {
    _id: ID!
    lbmServiceId: String!
    lbmId: String!
    rating: Int!
  }
`

export default connectLbmAndLbmServiceTypeDefs
