import gql from 'graphql-tag'

export const SEND_TO_SUBSCRIBED_USERS = gql`
  mutation SendToSubscribedUsers($input: SendToSubscribedUsersInput!) {
    sendToSubscribedUsers(input: $input) {
      message
      failedEmails
    }
  }
`

export const SEND_TO_TEST_GROUP = gql`
  mutation SendToTestGroup($input: SendToTestGroupInput!) {
    sendToTestGroup(input: $input) {
      message
    }
  }
`
