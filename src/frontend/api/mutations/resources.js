import gql from 'graphql-tag'

export const TOGGLE_ACCOUNT = gql`
  mutation ToggleAccount($input: JSON!) {
    toggleAccount(input: $input)
  }
`

export const TOGGLE_INDICATION = gql`
  mutation ToggleIndication($input: JSON!) {
    toggleIndication(input: $input)
  }
`

export const TOGGLE_REGIMEN = gql`
  mutation ToggleRegimen($input: JSON!) {
    toggleRegimen(input: $input)
  }
`
