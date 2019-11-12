import gql from 'graphql-tag'

export const SELECT_USER = gql`
  mutation SelectUser($_id: String) {
    selectUser(_id: $_id) @client {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`

export const MANAGE_CREATED_USER = gql`
  mutation ManageCreatedUser($data: JSON) {
    manageCreatedUser(data: $data) @client {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`

export const MANAGE_DELETED_USER = gql`
  mutation ManageDeletedUser($data: JSON) {
    manageDeletedUser(data: $data) @client {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`

export const MANAGE_UPDATED_USER = gql`
  mutation ManageUpdatedUser($data: JSON) {
    manageUpdatedUser(data: $data) @client {
      _id
      username
      email
      emailSubscriptions {
        _id
        type
      }
    }
  }
`
