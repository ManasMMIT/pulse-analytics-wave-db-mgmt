import gql from 'graphql-tag'

export const UPDATE_VEGA_PROVIDER = gql`
  mutation UpdateVegaProvider($input: UpdateVegaProviderInput!) {
    updateVegaProvider(input: $input) {
      id
      slug
      name
      name_tiny
      type
      institutions {
        id
        name
        created_at
        updated_at
      }
      community_practice_network {
        id
        name
        created_at
        updated_at
      }
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
