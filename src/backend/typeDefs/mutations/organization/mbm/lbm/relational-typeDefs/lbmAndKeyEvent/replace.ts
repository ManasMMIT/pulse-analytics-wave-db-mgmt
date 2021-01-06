import { gql } from 'apollo-server-express'

const connectLbmAndKeyEventTypeDefs = gql`
  input ConnectLbmAndKeyEventInput {
    lbmId: ID!
    keyEvents: [LbmKeyEventInput!]!
  }

  input LbmKeyEventInput {
    _id: ID!
    lbmId: String!
    date: String
    title: String
    description: String
    link: String
    internalTdgNote: String
  }
`

export default connectLbmAndKeyEventTypeDefs
