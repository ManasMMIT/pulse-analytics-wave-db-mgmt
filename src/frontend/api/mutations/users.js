import gql from 'graphql-tag'

export const SELECT_USER = gql`
  mutation SelectUser($_id: String) {
    selectUser(_id: $_id) @client {
      _id
      username
      email
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser(
    $username: String,
    $email: String,
    $password: String,
    $roles: [String],
  ) {
    createUser(
      username: $username,
      email: $email,
      password: $password,
      roles: $roles,
    ) @client {
      _id
      username
      email
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($_id: String) {
    deleteUser(_id: $_id) @client {
      _id
      username
      email
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $_id: String,
    $username: String,
    $email: String,
    $password: String,
    $roles: [String],
  ) {
    updateUser(
      _id: $_id,
      username: $username,
      email: $email,
      password: $password,
      roles: $roles,
    ) @client {
      _id
      username
      email
    }
  }
`
