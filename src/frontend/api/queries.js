import gql from 'graphql-tag'

export const GET_TEAM_SITEMAP = gql`
  query getSitemap($roleId: String) {
    sitemap(roleId: $roleId) @rest(type: "Sitemap", path: "/sitemaps/{args.roleId}") {
      id
      name
      kids
    }
    selectedTeam @client {
      id @export(as: "roleId")
    }
  }
`

export const GET_CLIENTS = gql`
  query getClients {
    clients @rest(type: "Client", path: "/clients") {
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

export const GET_CLIENT_TEAMS = gql`
  query getTeams($clientId: String) {
    teams(clientId: $clientId) @rest(type: "Team", path: "/clients/{args.clientId}/roles") {
      id
      name
      description
      isDefault
    }
    selectedClient @client {
      id @export(as: "clientId")
    }
  }
`

export const GET_SELECTED_TEAM = gql`
  query getSelectedTeam {
    selectedTeam @client {
      id
      name
      description
    }
  }
`

export const GET_TEAM_USERS = gql`
  query getTeamUsers($teamId: String) {
    users(teamId: $teamId) @rest(type: "User", path: "/roles/{args.teamId}/users") {
      id
      username
      email
      roles @type(name: "Team") {
        id
        name
        description
      }
    }
    selectedTeam @client {
      id @export(as: "teamId")
    }
  }
`

export const GET_SELECTED_USER = gql`
  query getSelectedUser {
    selectedUser @client {
      id
      username
      email
    }
  }
`
