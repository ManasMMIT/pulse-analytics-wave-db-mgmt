import gql from 'graphql-tag'

export const EMAIL_ALERTS = gql`
  mutation EmailAlerts($input: EmailAlertInput!) {
    emailAlerts(input: $input)
  }
`

export const CREATE_EMAIL_USERS = gql`
  mutation CreateEmailUsers($input: CreateEmailUsersInput!) {
    createEmailUsers(input: $input)
  }
`

export const DELETE_EMAIL_USERS = gql`
  mutation DeleteEmailUsers($input: DeleteEmailUsersInput!) {
    deleteEmailUsers(input: $input)
  }
`