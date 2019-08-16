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
  mutation CreateClient($description: String) {
    createClient(description: $description) @client {
      _id
      name
      description
    }
  }
`
