import { gql } from 'apollo-server-express'

const connectLbmAndLbmTypeTypeDefs = gql`
  input ConnectLbmAndLbmTypeInput {
    _id: ID
    lbmId: String!
    lbmTypeId: String!
  }

  type ConnectLbmAndLbmTypePayload {
    _id: ID!
    lbmId: String!
    lbmTypeId: String!
  }
`

export default connectLbmAndLbmTypeTypeDefs
