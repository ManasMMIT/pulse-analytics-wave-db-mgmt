import { gql } from 'apollo-server-express'

const deleteVegaCommunityPracticeNetworkTypeDefs = gql`
  input DeleteVegaCommunityPracticeNetworkInput {
    id: ID!
  }
`

export default deleteVegaCommunityPracticeNetworkTypeDefs
