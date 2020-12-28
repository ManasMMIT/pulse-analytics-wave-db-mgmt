import { gql } from 'apollo-server-express'

const updateLbmTypeTypeDefs = gql`
  input UpdateLbmTypeInput {
    _id: ID!
    name: String!
    description: String
  }
`

export default updateLbmTypeTypeDefs
