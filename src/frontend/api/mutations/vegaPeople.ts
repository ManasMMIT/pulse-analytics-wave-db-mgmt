import gql from 'graphql-tag'

export const UPDATE_VEGA_PERSON = gql`
  mutation UpdateVegaPerson($input: UpdateVegaPersonInput!) {
    updateVegaPerson(input: $input) {
      id
      first_name
      last_name
      middle_name
      primary_state {
        id
        full_name
        abbreviation
        created_at
        updated_at
      }
      role {
        id
        name
        default_specialty_label
        type {
          id
          name
          created_at
          updated_at
        }
        created_at
        updated_at
      }
      perception_tool_provider {
        id
        slug
        name
        name_tiny
        type
        state {
          id
          full_name
          abbreviation
        }
      }
      role_specialties {
        id
        specialty_label
        person_role
        indication {
          id
          name
          regimens
          created_at
          updated_at
        }
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`
