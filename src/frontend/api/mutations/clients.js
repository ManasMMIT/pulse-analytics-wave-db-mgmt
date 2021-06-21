import gql from 'graphql-tag'

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      _id
      name
      description
      icon
    }
  }
`

export const DELETE_CLIENT = gql`
  mutation DeleteClient($input: DeleteClientInput!) {
    deleteClient(input: $input) {
      _id
      name
      description
      icon
    }
  }
`

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      _id
      name
      description
      icon
    }
  }
`
