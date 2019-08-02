import gql from 'graphql-tag'

export const SELECT_CLIENT = gql`
  mutation SelectClient($id: String) {
    selectedClient(id: $id) @client {
      id
      name
      description
    }
  }
`

export const CREATE_CLIENT = gql`
  mutation CreateClient($description: String) {
    createdClient(description: $description) @client {
      id
      name
      description
    }
  }
`

export const SELECT_TEAM = gql`
  mutation SelectTeam($id: String) {
    selectedTeam(id: $id) @client {
      id
      name
      description
    }
  }
`

export const CREATE_TEAM = gql`
  mutation CreateTeam($description: String) {
    createdTeam(description: $description) @client {
      id
      name
      description
    }
  }
`

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: String) {
    deletedTeam(id: $id) @client {
      id
      name
      description
    }
  }
`

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($description: String) {
    updatedTeam(description: $description) @client {
      id
      name
      description
    }
  }
`

export const SELECT_USER = gql`
  mutation SelectUser($id: String) {
    selectedUser(id: $id) @client {
      id
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
    createdUser(
      username: $username,
      email: $email,
      password: $password,
      roles: $roles,
    ) @client {
      id
      username
      email
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: String) {
    deletedUser(id: $id) @client {
      id
      username
      email
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String,
    $username: String,
    $email: String,
    $password: String,
    $roles: [String],
  ) {
    updatedUser(
      id: $id,
      username: $username,
      email: $email,
      password: $password,
      roles: $roles,
    ) @client {
      id
      username
      email
      roles
    }
  }
`
