import gql from 'graphql-tag'

export const GET_PEOPLE = gql`
  query getPeople {
    people {
      _id
      name
      nationalProviderIdentifier
    }
  }
`

export const GET_BOOKS = gql`
  query getBooks {
    books {
      _id
      name
    }
  }
`

export const GET_COVERAGES = gql`
  query getCoverages {
    coverages {
      _id
      name
    }
  }
`

export const GET_POPULATIONS = gql`
  query getPopulations {
    populations {
      _id
      name
    }
  }
`

export const GET_LINES = gql`
  query getLines {
    lines {
      _id
      name
    }
  }
`

export const GET_CMS_PRIM_SPEC_COUNTS = gql`
  query getCmsPrimarySpecialtyCounts($orgPacId: String) {
    cMsOrgPrimarySpecialtyCounts(orgPacId: $orgPacId)
  }
`

export const GET_BOM_SCHEMA = gql`
  query getBomSchema($boId: ID) {
    bomSchema(boId: $boId)
  }
`

export const GET_BOM_CONFIGS = gql`
  query getBomConfigs {
    bomConfigs {
      _id
      boId
      label
      tags {
        _id
        label
        sections {
          _id
          label
          fields {
            _id
            boFieldId
            label
            inputComponent
            inputProps
          }
        }
      }
    }
  }
`

export const GET_AQUILA_CONFIGS = gql`
  query getAquilaConfigs {
    aquilaConfigs {
      _id
      boId
      label
      fields {
        _id
        boFieldId
        label
        inputProps
      }
    }
  }
`

export const GET_AQUILA_BO_FILTER_SETTINGS = gql`
  query getAquilaBoFilterSettings($boId: ID!) {
    aquilaBoFilterSettings(boId: $boId) {
      _id
      label
      fields {
        _id
        boFieldId
        boFieldKey
        inputProps
        label
      }
    }
  }
`

export const GET_AQUILA_PQL_RESULTS = gql`
  query getAquilaPqlResults($pql: String!) {
    aquilaPqlResults(pql: $pql)
  }
`

export const GET_AQUILA_BUSINESS_OBJECTS = gql`
  query getAquilaBusinessObjects {
    aquilaBusinessObjects {
      _id
      boId
      label
      boName
    }
  }
`

export const GET_BUSINESS_OBJECTS = gql`
  query getBusinessObjects {
    businessObjects {
      _id
      name
      sourceCollection {
        collection
      }
      fields {
        _id
        key
        type
      }
    }
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
      defaultLandingPath
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
      defaultLandingPath
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
      defaultLanding {
        locked
        path
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

export const GET_TEAMS = gql`
  query getAllTeams {
    teams {
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
    }
  }
`

export const GET_SELECTED_USER = gql`
  query getSelectedUser {
    selectedUser @client {
      _id
      username
      email
      # Note: don't think the below is needed for this
      # defaultLanding {
      #   locked
      #   path
      # }
    }
  }
`

export const GET_SOURCE_NODES = gql`
  query getSourceNodes {
    nodes {
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
  query getToolDashboards($parentId: String) {
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
  query getDashboardPages($parentId: String) {
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
  query getPageCards($parentId: String) {
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
      groupPracticePacId
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

export const GET_OBM_SERVICES = gql`
  query getObmServices {
    obmServices {
      _id
      name
    }
  }
`

export const GET_OBM_SERVICES_CATEGORIES = gql`
  query getObmServicesCategories {
    obmServicesCategories {
      _id
      name
    }
  }
`

export const GET_OBM_ORGANIZATIONS = gql`
  query getObmOrganizations {
    obmOrganizations {
      _id
      slug
      organization
      organizationTiny
      type
      start
      businessModel
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

export const GET_FULL_OP_LOGS = gql`
  query getFullOpLogs($maxLineCount: Int) {
    fullOpLogs(maxLineCount: $maxLineCount) {
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
          businessObjRef
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

export const GET_PAYER_PROJECT_IMPORT_TIMESTAMPS = gql`
  query getPayerProjectImportTimestamps($projectId: ID!) {
    payerProjectPtpsImportTimestamps(projectId: $projectId) {
      timestamps
    }
  }
`

export const GET_SINGLE_PAYER_PROJECT = gql`
  query getSinglePayerProject($projectId: String) {
    singlePayerProject(projectId: $projectId) {
      _id
      name
      timestamps
    }
  }
`

export const GET_SOURCE_TREATMENT_PLANS = gql`
  query getSourceTreatmentPlans {
    treatmentPlans {
      _id
      indication
      regimen
      line
      population
      book
      coverage
    }
  }
`

export const GET_PAYER_PROJECT_PTPS = gql`
  query getPayerProjectPtps($input: PayerProjectPtpsInput!) {
    payerProjectPtps(input: $input) {
      _id
      treatmentPlanId
      organizationId
      slug
      organization
      organizationTiny
      indication
      population
      line
      regimen
      book
      coverage
      project
    }
  }
`

export const GET_REGIONAL_TARGETING_DATA = gql`
  query getRegionalTargetingData($input: JSON) {
    regionalTargetingData(input: $input)
  }
`

export const GET_OBM_SERVICE_AND_OBM_SERVICE_CATEGORY_CONNECTIONS = gql`
  query getObmServiceAndObmServiceCategoryConnections($obmServiceId: String) {
    obmServiceAndObmServiceCategoryConnections(obmServiceId: $obmServiceId) {
      _id
      obmServiceId
      obmServiceCategoryId
    }
  }
`

export const GET_OBM_AND_OBM_SERVICE_CONNECTIONS = gql`
  query getObmAndObmServiceConnections($obmId: String) {
    obmAndObmServiceConnections(obmId: $obmId) {
      _id
      obmId
      obmServiceId
      rating
    }
  }
`

export const GET_OBM_AND_PERSON_CONNECTIONS = gql`
  query getObmAndPersonConnections($obmId: ID) {
    obmAndPersonConnections(obmId: $obmId) {
      _id
      obmId
      personId
      position
    }
  }
`

export const GET_EMAIL_DEVICE_METRICS = gql`
  query getEmailDeviceMetrics {
    emailDeviceMetrics
  }
`
