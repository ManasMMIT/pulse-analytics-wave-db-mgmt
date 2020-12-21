import { gql } from 'apollo-server-express'

const createLbmTypeTypeDefs = gql`
  input CreateLbmTypeInput {
    name: String!
    description: String
  }
`

export default createLbmTypeTypeDefs
