import { gql } from 'apollo-server-express'

const updateVegaCommunityPracticeNetworkTypeDefs = gql`
  input UpdateVegaCommunityPracticeNetworkInput {
    id: ID!
    name: String
  }
`

export default updateVegaCommunityPracticeNetworkTypeDefs
