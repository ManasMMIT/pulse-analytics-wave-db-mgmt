import gql from 'graphql-tag'

export const TOGGLE_ACCOUNT = gql`
  mutation ToggleAccount($input: JSON!) {
    toggleAccount(input: $input)
  }
`