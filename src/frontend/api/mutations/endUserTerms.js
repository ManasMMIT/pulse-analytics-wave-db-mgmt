import gql from 'graphql-tag'

export const UPDATE_END_USER_TERMS = gql`
  mutation UpdateEndUserTerms($input: UpdateEndUserTermsInput!) {
    updateEndUserTerms(input: $input) {
      _id
      link
    }
  }
`
