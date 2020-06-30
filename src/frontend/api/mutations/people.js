import gql from 'graphql-tag'

export const CREATE_PERSON = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      _id
      firstName
      lastName
      nationalProviderIdentifier
    }
  }
`

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($input: UpdatePersonInput!) {
    updatePerson(input: $input) {
      _id
      firstName
      lastName
      nationalProviderIdentifier
    }
  }
`

export const DELETE_PERSON = gql`
  mutation DeletePerson($input: DeletePersonInput!) {
    deletePerson(input: $input) {
      _id
      firstName
      lastName
      nationalProviderIdentifier
    }
  }
`
