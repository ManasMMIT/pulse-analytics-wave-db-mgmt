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
