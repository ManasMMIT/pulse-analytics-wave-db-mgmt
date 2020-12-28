import { gql } from 'apollo-server-express'

const upsertLbmAndPayerConnectionTypeDefs = gql`
  input UpsertLbmAndPayerConnectionInput {
    _id: ID
    payerId: String!
    lbmId: String!
    note: String
    books: [LbmAndPayerConnectionBookObjInput!]!
  }

  input LbmAndPayerConnectionBookObjInput {
    _id: String!
    name: String!
    isNational: Boolean!
    states: [String!]!
  }
`

export default upsertLbmAndPayerConnectionTypeDefs
