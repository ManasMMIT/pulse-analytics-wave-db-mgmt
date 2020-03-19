import gql from 'graphql-tag'

export const GET_BOM_SCHEMA = gql`
  query getBomSchema($boId: ID) {
    bomSchema(boId: $boId)
  }
`

export const GET_ORGANIZATION_META = gql`
  query getOrganizationMeta($_ids: [ID]) {
    organizationMeta(_ids: $_ids) {
      _id
      accountId
      exportedAt
      exporter
      updatedAt
      updater
    }
  }
`

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
        name
        description
      }
      resources
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
      isDefault
      sitemap
      client {
        _id
      }
      resources
    }
  }
`

export const GET_USERS = gql`
  query getUsers($subscriptionId: String) {
    users(subscriptionId: $subscriptionId) {
      _id
      username
      email
      client {
        _id
        name
        description
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
      emailSubscriptions {
        _id
        type
      }
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

export const GET_PATH_NODES = gql`
  query getPathNodes($roleId: ID) {
    pathNodes(roleId: $roleId)
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
      caption
    }
  }
`

export const GET_PROVIDER_ORGANIZATIONS = gql`
  query getProviderOrganizations {
    providerOrganizations {
      _id
      slug
      organization
      organizationTiny
      providerCancerCenter
      type
      connections
      state
      city
      oncologistsCount
      sitesCount
    }
  }
`

export const GET_PAYER_ORGANIZATIONS = gql`
  query getPayerOrganizations {
    payerOrganizations {
      _id
      slug
      organization
      organizationTiny
      type
      connections
    }
  }
`

export const GET_PATHWAYS_ORGANIZATIONS = gql`
  query getPathwaysOrganizations {
    pathwaysOrganizations {
      _id
      slug
      organization
      organizationTiny
      type
      connections
    }
  }
`

export const GET_APM_ORGANIZATIONS = gql`
  query getApmOrganizations {
    apmOrganizations {
      _id
      slug
      organization
      organizationTiny
      type
      connections
    }
  }
`

export const GET_RAW_COLLECTION_NAMES = gql`
  query getRawCollectionNames {
    collections(type: "raw")
  }
`

export const GET_NEW_TREATMENT_PLANS = gql`
  query getNewTreatmentPlans($data: JSON) {
    newTreatmentPlans(data: $data)
  }
`

export const GET_TEST_EMAIL_GROUPS = gql`
  query getTestEmailGroups {
    testEmailGroups {
      _id
      name
      recipients
      usersToMock
      emailSubscriptions
    }
  }
`

export const GET_ALERT = gql`
  query getAlert($_id: ID) {
    alert(_id: $_id) {
      _id
      date
      type
      description
    }
  }
`

export const GET_OP_LOG = gql`
  query getOpLog {
    opLogs {
      timestamp
      username
      userId
      operationName
      operationVariables
    }
  }
`

export const GET_WORKBOOKS = gql`
  query getWorkbooks {
    workbooks {
      _id
      name
      sheets {
        _id
        name
        collection
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const GET_PAYER_PROJECTS_LIST = gql`
 query getPayerProjectsList {
   payerProjectsList {
     _id
     name
   }
 }
`
