import { gql } from 'apollo-server-express'

const connectLbmAndPersonTypeDefs = gql`
  input ConnectLbmAndPersonInput {
    _id: ID
    personId: String!
    lbmId: String!
    position: String
    managementTypes: [String!]!
  }

  type ConnectLbmAndPersonPayload {
    _id: ID!
    personId: String!
    lbmId: String!
    position: String
    managementTypes: [String!]!
  }
`

export default connectLbmAndPersonTypeDefs
