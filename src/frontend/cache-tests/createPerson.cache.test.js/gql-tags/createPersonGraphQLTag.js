import { gql } from '@apollo/client'

export default gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      _id
      firstName
      lastName
      nationalProviderIdentifier
      physicianProfileId
    }
  }
`
