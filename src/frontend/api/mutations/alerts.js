import gql from 'graphql-tag'

export const EMAIL_ALERTS = gql`
  mutation EmailAlerts($input: EmailAlertInput!) {
    emailAlerts(input: $input)
  }
`