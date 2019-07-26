import gql from 'graphql-tag'

export const GET_CLIENTS = gql`
  query getClients {
    clients @rest(type: "Client", path: "/clients") {
      id
      name
      description
    }
  }
`
export const GET_USERS = gql`
  query getUsers {
    users @rest(type: "User", path: "/users") {
      id
      username
      email
    }
  }
`

export const SELECT_CLIENT = gql`
  mutation SelectClient($id: String) {
    selectedClient(id: $id) @client {
      id
      name
      description
    }
  }
`

export const GET_SELECTED_CLIENT = gql`
  query getSelectedClient {
    selectedClient @client {
      id
      name
      description
    }
  }
`
