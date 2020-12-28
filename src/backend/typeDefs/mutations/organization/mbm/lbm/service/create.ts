import { gql } from 'apollo-server-express'

const createLbmServiceTypeDefs = gql`
  input CreateLbmServiceInput {
    name: String!
    description: String
  }

  type CreateLbmServicePayload {
    _id: ID!
    name: String!
    description: String
  }
`

export default createLbmServiceTypeDefs
