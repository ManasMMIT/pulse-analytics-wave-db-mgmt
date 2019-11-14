import gql from 'graphql-tag'

export const CREATE_TEST_EMAIL_GROUP = gql`
  mutation CreateTestEmailGroup {
    createTestEmailGroup {
      _id
      name
      recipients
      usersToMock
      emailSubscriptions
    }
  }
`

export const UPDATE_TEST_EMAIL_GROUP = gql`
  mutation UpdateTestEmailGroup($input: UpdateTestEmailGroupInput!) {
    updateTestEmailGroup(input: $input) {
      _id
      name
      recipients
      usersToMock
      emailSubscriptions
    }
  }
`
export const DELETE_TEST_EMAIL_GROUP = gql`
  mutation DeleteTestEmailGroup($input: DeleteTestEmailGroupInput!) {
    deleteTestEmailGroup(input: $input) {
      _id
      name
      recipients
      usersToMock
      emailSubscriptions
    }
  }
`
