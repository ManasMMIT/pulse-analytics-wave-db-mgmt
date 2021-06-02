import gql from 'graphql-tag'

export const CREATE_VEGA_PERSON_ROLE = gql`
  mutation CreateVegaPersonRole($input: CreateVegaPersonRoleInput!) {
    createVegaPersonRole(input: $input) {
      id
      name
      default_specialty_label
      type {
        id
        name
        created_at
        updated_at
      }
      people
      indication_specialties
      created_at
      updated_at
    }
  }
`

export const UPDATE_VEGA_PERSON_ROLE = gql`
  mutation UpdateVegaPersonRole($input: UpdateVegaPersonRoleInput!) {
    updateVegaPersonRole(input: $input) {
      id
      name
      default_specialty_label
      type {
        id
        name
        created_at
        updated_at
      }
      people
      indication_specialties
      created_at
      updated_at
    }
  }
`

export const DELETE_VEGA_PERSON_ROLE = gql`
  mutation DeleteVegaPersonRole($input: DeleteVegaPersonRoleInput!) {
    deleteVegaPersonRole(input: $input) {
      id
      name
      default_specialty_label
      type {
        id
        name
        created_at
        updated_at
      }
      people
      indication_specialties
      created_at
      updated_at
    }
  }
`

export const CREATE_VEGA_PERSON_ROLE_TYPE = gql`
  mutation CreateVegaPersonRoleType($input: CreateVegaPersonRoleTypeInput!) {
    createVegaPersonRoleType(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const UPDATE_VEGA_PERSON_ROLE_TYPE = gql`
  mutation UpdateVegaPersonRoleType($input: UpdateVegaPersonRoleTypeInput!) {
    updateVegaPersonRoleType(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const DELETE_VEGA_PERSON_ROLE_TYPE = gql`
  mutation DeleteVegaPersonRoleType($input: DeleteVegaPersonRoleTypeInput!) {
    deleteVegaPersonRoleType(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`
