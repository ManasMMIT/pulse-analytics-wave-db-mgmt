import gql from 'graphql-tag'

export const UPDATE_TEAM_NODE = gql`
  mutation UpdateTeamNode($input: UpdateTeamNodeInput!) {
    updateTeamNode(input: $input) {
      _id
      name
      type
      componentPath
      text
      order
      parentId
    }
  }
`

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      _id
      name
      uuid
      description
      isDefault
      sitemap
      client {
        _id
        name
        description
        icon
      }
      resources
      defaultLandingPath
    }
  }
`

export const DELETE_TEAM = gql`
  mutation DeleteTeam($input: DeleteTeamInput!) {
    deleteTeam(input: $input) {
      _id
      name
      uuid
      description
      isDefault
      sitemap
      client {
        _id
        name
        description
        icon
      }
      resources
      defaultLandingPath
    }
  }
`

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($input: UpdateTeamInput!) {
    updateTeam(input: $input) {
      _id
      name
      uuid
      description
      isDefault
      sitemap
      client {
        _id
        name
        description
        icon
      }
      resources
      defaultLandingPath
    }
  }
`

// update the resource obj for a selected team, for a single node
// belonging to that team
export const UPDATE_PERMISSIONS = gql`
  mutation UpdatePermissions($input: UpdatePermissionsInput!) {
    updatePermissions(input: $input) {
      _id
      name
      uuid
      description
      isDefault
      sitemap
      client {
        _id
        name
        description
      }
      resources
      defaultLandingPath
    }
  }
`
