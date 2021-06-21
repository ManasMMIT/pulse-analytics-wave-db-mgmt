import { gql } from 'apollo-server-express'

const createVegaCommunityPracticeNetworkTypeDefs = gql`
  input CreateVegaCommunityPracticeNetworkInput {
    name: String!
  }
`

export default createVegaCommunityPracticeNetworkTypeDefs
