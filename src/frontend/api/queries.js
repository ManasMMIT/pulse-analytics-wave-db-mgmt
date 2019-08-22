import gql from 'graphql-tag'

export const GET_TEAM_SITEMAP = gql`
  query getSitemap($roleId: String) {
    sitemap(roleId: $roleId) @rest(type: "Sitemap", path: "/sitemaps/{args.roleId}") {
      tools
      dashboards
      pages
      cards
    }
    selectedTeam @client {
      _id @export(as: "roleId")
    }
  }
`

export const GET_CLIENTS = gql`
  query getClients {
    clients @rest(type: "Client", path: "/clients") {
      _id
      name
      description
    }
  }
`

export const GET_SELECTED_CLIENT = gql`
  query getSelectedClient {
    selectedClient @client {
      _id
      name
      description
    }
  }
`

export const GET_CLIENT_TEAMS = gql`
  query getTeams($clientId: String) {
    teams(clientId: $clientId) @rest(type: "Team", path: "/clients/{args.clientId}/roles") {
      _id
      name
      description
      isDefault
      sitemap
    }
    selectedClient @client {
      _id @export(as: "clientId")
    }
  }
`

export const GET_SELECTED_TEAM = gql`
  query getSelectedTeam {
    selectedTeam @client {
      _id
      name
      description
      sitemap
    }
  }
`

export const GET_TEAM_USERS = gql`
  query getTeamUsers($teamId: String) {
    users(teamId: $teamId) @rest(type: "User", path: "/roles/{args.teamId}/users") {
      _id
      username
      email
    }
    selectedTeam @client {
      _id @export(as: "teamId")
    }
  }
`

export const GET_USER_TEAMS = gql`
  query getUserTeams($userId: String) {
    userTeams(userId: $userId) @rest(type: "Team", path: "/users/{args.userId}/roles") {
      _id
      name
      description
      isDefault
    }
  }
`

export const GET_SELECTED_USER = gql`
  query getSelectedUser {
    selectedUser @client {
      _id
      username
      email
    }
  }
`

export const GET_SOURCE_TOOLS = gql`
  query getSourceTools {
    nodes(type: "tool") {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
  }
`

export const GET_SELECTED_TOOL = gql`
  query getSelectedTool {
    selectedTool @client {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
  }
`

export const GET_TOOL_DASHBOARDS = gql`
  query getToolDashboards($parentId: String)  {
    nodes(type: "dashboard", parentId: $parentId) {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
    selectedTool @client {
      _id @export(as: "parentId")
    }
  }
`

export const GET_SELECTED_DASHBOARD = gql`
  query getSelectedDashboard {
    selectedDashboard @client {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
  }
`

export const GET_DASHBOARD_PAGES = gql`
  query getDashboardPages($parentId: String)  {
    nodes(type: "page", parentId: $parentId) {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
    selectedDashboard @client {
      _id @export(as: "parentId")
    }
  }
`

export const GET_SELECTED_PAGE = gql`
  query getSelectedPage {
    selectedPage @client {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
  }
`

export const GET_PAGE_CARDS = gql`
  query getPageCards($parentId: String)  {
    nodes(type: "card", parentId: $parentId) {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
    selectedPage @client {
      _id @export(as: "parentId")
    }
  }
`

export const GET_SELECTED_CARD = gql`
  query getSelectedCard {
    selectedCard @client {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
    }
  }
`
