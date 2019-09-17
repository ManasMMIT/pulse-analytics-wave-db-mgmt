import gql from 'graphql-tag'

export const GET_CLIENTS = gql`
  query getClients {
    clients {
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
    teams(clientId: $clientId) {
      _id
      name
      description
      isDefault
      sitemap
      client {
        _id
      }
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
      client {
        _id
      }
    }
  }
`

export const GET_TEAM_USERS = gql`
  query getTeamUsers($teamId: String) {
    users(teamId: $teamId) {
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
    teams(userId: $userId) {
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
      resources
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
      resources
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
      resources
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
      resources
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
      resources
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
      resources
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
      resources
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
      resources
    }
  }
`

export const GET_SOURCE_INDICATIONS = gql`
  query getSourceIndications {
    indications {
      _id
      name
      regimens {
        _id
        name
        products {
          _id
          nameGeneric
          nameBrand
          tags
        }
      }
    }
  }
`

export const GET_SELECTED_INDICATION = gql`
  query getSelectedIndication {
    selectedIndication @client {
      _id
      name
      regimens {
        _id
        name
        products {
          _id
          nameGeneric
          nameBrand
          tags
        }
      }
    }
  }
`

export const GET_SELECTED_REGIMENS = gql`
  query getSelectedRegimens {
    selectedRegimens @client {
      _id
      name
      products {
        _id
        nameGeneric
        nameBrand
        tags
      }
    }
  }
`

export const GET_SOURCE_PRODUCTS = gql`
  query getSourceProducts {
    products {
      _id
      nameGeneric
      nameBrand
      tags
    }
  }
`
export const GET_SOURCE_REGIMENS = gql`
  query getSourceRegimens {
    regimens {
      _id
      name
      products {
        _id
        nameGeneric
        nameBrand
        tags
      }
    }
  }
`

export const GET_STAGED_SITEMAP = gql`
  query getStagedSitemap {
    stagedSitemap @client {
      _id
      tools
      dashboards
      pages
      cards
    }
  }
`

export const GET_SOURCE_QUALITY_OF_ACCESS_SCORES = gql`
  query getQualityOfAccessScores {
    qualityOfAccessScores {
      _id
      access
      accessTiny
      score
      sortOrder
      color
      relevance
      caption
    }
  }
`
