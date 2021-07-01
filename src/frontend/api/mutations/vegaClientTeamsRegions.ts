import gql from 'graphql-tag'

export const CREATE_VEGA_CLIENT_TEAM_REGION = gql`
  mutation CreateVegaClientTeamRegion($input: CreateVegaClientTeamRegionInput!) {
    createVegaClientTeamRegion(input: $input) {
      id
      name
      team
      created_at
      updated_at
    }
  }
`

export const UPDATE_VEGA_CLIENT_TEAM_REGION = gql`
  mutation UpdateVegaClientTeamRegion($input: UpdateVegaClientTeamRegionInput!) {
    updateVegaClientTeamRegion(input: $input) {
      id
      name
      team
      created_at
      updated_at
    }
  }
`

export const DELETE_VEGA_CLIENT_TEAM_REGION = gql`
  mutation DeleteVegaClientTeamRegion($input: DeleteVegaClientTeamRegionInput!) {
    deleteVegaClientTeamRegion(input: $input) {
      id
      name
      team
      created_at
      updated_at
    }
  }
`
