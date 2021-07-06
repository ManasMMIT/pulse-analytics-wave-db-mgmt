import { gql } from 'apollo-server-express'

const dropAndCreateRegionTypeDefs = gql`
  type CreateTeamTeamRegionStateInput {
    team_id: ID!
    team_region_id: ID!
    state_id: ID!
  }

  input DropAndCreateRegionInput {
    team_region_id: ID!
    teams_teams_regions_states: [CreateTeamTeamRegionStateInput!]!
  }
`

export default dropAndCreateRegionTypeDefs
