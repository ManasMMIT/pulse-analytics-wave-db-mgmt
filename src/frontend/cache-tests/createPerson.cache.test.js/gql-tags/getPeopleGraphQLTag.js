import { gql } from '@apollo/client'

export default gql`
  query getPeople {
    people {
      _id
      createdOn
      updatedOn
      firstName
      lastName
      nationalProviderIdentifier
      physicianProfileId
    }
  }
`
