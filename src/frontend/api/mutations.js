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

export const SELECT_USER = gql`
  mutation SelectUser($id: String) {
    selectedUser(id: $id) @client {
      id
      username
      email
    }
  }
`
