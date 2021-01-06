import { gql } from 'apollo-server-express'

const updateLbmServiceTypeDefs = gql`
  input UpdateLbmServiceInput {
    _id: ID!
    name: String!
    description: String
  }

  type UpdateLbmServicePayload {
    _id: ID!
    name: String!
    description: String
  }
`

export default updateLbmServiceTypeDefs
