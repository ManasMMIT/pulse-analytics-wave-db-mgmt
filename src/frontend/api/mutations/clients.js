import gql from 'graphql-tag'

export const SELECT_CLIENT = gql`
  mutation SelectClient($_id: String) {
    selectClient(_id: $_id) @client {
      _id
      name
      description
    }
  }
`

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      _id
      name
      description
    }
  }
`

export const DELETE_CLIENT = gql`
  mutation DeleteClient($input: DeleteClientInput!) {
    deleteClient(input: $input) {
      _id
      name
      description
    }
  }
`

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      _id
      name
      description
    }
  }
`

export const MANAGE_CREATED_CLIENT = gql`
  mutation ManageCreatedClient($data: JSON) {
    manageCreatedClient(data: $data) @client {
      _id
      name
      description
    }
  }
`

export const MANAGE_DELETED_CLIENT = gql`
  mutation ManageDeletedClient($data: JSON) {
    manageDeletedClient(data: $data) @client {
      _id
      name
      description
    }
  }
`
