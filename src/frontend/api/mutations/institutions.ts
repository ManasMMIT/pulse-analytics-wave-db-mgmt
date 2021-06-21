import gql from 'graphql-tag'

export const CREATE_INSTITUTION = gql`
  mutation CreateVegaInstitution($input: CreateVegaInstitutionInput!) {
    createVegaInstitution(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const UPDATE_INSTITUTION = gql`
  mutation UpdateVegaInstitution($input: UpdateVegaInstitutionInput!) {
    updateVegaInstitution(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const DELETE_INSTITUTION = gql`
  mutation DeleteVegaInstitution($input: DeleteVegaInstitutionInput!) {
    deleteVegaInstitution(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`
