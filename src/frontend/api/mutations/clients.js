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

export const MANAGE_CREATED_CLIENT = gql`
  mutation ManageCreatedClient($data: JSON) {
    manageCreatedClient(data: $data) @client {
      _id
      name
      description
    }
  }
`
