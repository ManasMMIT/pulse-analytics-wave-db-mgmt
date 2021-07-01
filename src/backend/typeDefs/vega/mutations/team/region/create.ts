import { gql } from 'apollo-server-express'

const createVegaClientTeamRegionTypeDefs = gql`
  input CreateVegaClientTeamRegionInput {
    name: String!
    team_id: ID!
  }
`

export default createVegaClientTeamRegionTypeDefs
