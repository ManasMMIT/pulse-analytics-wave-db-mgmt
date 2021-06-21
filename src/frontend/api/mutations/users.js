import gql from 'graphql-tag'

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      firstName
      lastName
      username
      email
      client {
        _id
        name
        description
        icon
      }
      emailSubscriptions {
        _id
        type
      }
      defaultLanding {
        locked
        path
      }
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      _id
      firstName
      lastName
      username
      email
      client {
        _id
        name
        description
        icon
      }
      emailSubscriptions {
        _id
        type
      }
      defaultLanding {
        locked
        path
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      firstName
      lastName
      username
      email
      client {
        _id
        name
        description
        icon
      }
      emailSubscriptions {
        _id
        type
      }
      defaultLanding {
        locked
        path
      }
    }
  }
`
