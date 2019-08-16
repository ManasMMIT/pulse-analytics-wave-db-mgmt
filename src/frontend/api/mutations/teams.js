import gql from 'graphql-tag'

export const SELECT_TEAM = gql`
  mutation SelectTeam($_id: String) {
    selectTeam(_id: $_id) @client {
      _id
      name
      description
    }
  }
`

export const CREATE_TEAM = gql`
  mutation CreateTeam($description: String) {
    createTeam(description: $description) @client {
      _id
      name
      description
    }
  }
`

export const DELETE_TEAM = gql`
  mutation DeleteTeam($_id: String) {
    deleteTeam(_id: $_id) @client {
      _id
      name
      description
    }
  }
`

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($description: String) {
    updateTeam(description: $description) @client {
      _id
      name
      description
    }
  }
`
