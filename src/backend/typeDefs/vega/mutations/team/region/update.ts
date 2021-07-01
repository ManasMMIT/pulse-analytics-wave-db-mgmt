import { gql } from 'apollo-server-express'

const updateVegaClientTeamRegionTypeDefs = gql`
  input UpdateVegaClientTeamRegionInput {
    id: ID!
    name: String
  }
`

export default updateVegaClientTeamRegionTypeDefs
