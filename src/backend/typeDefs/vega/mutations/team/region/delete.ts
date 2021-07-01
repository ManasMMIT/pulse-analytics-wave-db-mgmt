import { gql } from 'apollo-server-express'

const deleteVegaClientTeamRegionTypeDefs = gql`
  input DeleteVegaClientTeamRegionInput {
    id: ID!
  }
`

export default deleteVegaClientTeamRegionTypeDefs
