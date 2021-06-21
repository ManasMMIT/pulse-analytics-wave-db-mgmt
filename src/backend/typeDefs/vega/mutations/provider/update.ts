import { gql } from 'apollo-server-express'

const updateVegaProviderTypeDefs = gql`
  input UpdateVegaProviderInput {
    id: ID!
    type: String
    institutions_ids: [ID!]
    community_practice_network_id: ID
  }
`

export default updateVegaProviderTypeDefs
