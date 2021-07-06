import gql from 'graphql-tag'

export const DROP_AND_CREATE_REGION = gql`
  mutation DropAndCreateRegion($input: DropAndCreateRegionInput!) {
    dropAndCreateRegion(input: $input) {
      id
      team
      team_region
      state {
        id
        full_name
        abbreviation
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`
