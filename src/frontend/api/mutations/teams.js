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
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      _id
      name
      description
      isDefault
      sitemap
      client {
        _id
      }
    }
  }
`

export const MANAGE_CREATED_TEAM = gql`
  mutation ManageCreatedTeam($data: JSON) {
    manageCreatedTeam(data: $data) @client {
      _id
      name
      description
      isDefault
      sitemap
      client {
        _id
      }
    }
  }
`

export const DELETE_TEAM = gql`
  mutation DeleteTeam($input: DeleteTeamInput!) {
    deleteTeam(input: $input) {
      _id
      name
      description
    }
  }
`

export const MANAGE_DELETED_TEAM = gql`
  mutation ManageDeletedTeam($data: JSON) {
    manageDeletedTeam(data: $data) @client {
      _id
      name
      description
    }
  }
`

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($input: UpdateTeamInput!) {
    updateTeam(input: $input) {
      _id
      name
      description
      sitemap
      client {
        _id
      }
    }
  }
`

export const MANAGE_UPDATED_TEAM = gql`
  mutation ManageUpdatedTeam($data: JSON) {
    manageUpdatedTeam(data: $data) @client {
      _id
      name
      description
      sitemap
      client {
        _id
      }
    }
  }
`
