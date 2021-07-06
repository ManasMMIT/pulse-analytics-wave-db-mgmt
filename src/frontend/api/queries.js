import gql from 'graphql-tag'

export const GET_VEGA_CLIENT_TEAMS = gql`
  query getVegaClientTeams($clientTeamId: ID) {
    vegaClientTeams(clientTeamId: $clientTeamId) {
      id
      name
      created_at
      updated_at
      client {
        id
        name
        created_at
        updated_at
      }
    }
  }
`

export const GET_VEGA_CLIENT_TEAMS_REGIONS = gql`
  query getVegaClientTeamsRegions($clientTeamId: ID) {
    vegaClientTeamsRegions(clientTeamId: $clientTeamId) {
      id
      name
      team
      created_at
      updated_at
    }
  }
`

export const GET_TEAMS_TEAMS_REGIONS_STATES = gql`
  query getVegaTeamsTeamsRegionsStates($clientTeamId: ID) {
    vegaTeamsTeamsRegionsStates(clientTeamId: $clientTeamId) {
      id
      team
      team_region
      state {
        id
        full_name
        abbreviation
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`

export const GET_VEGA_PEOPLE = gql`
  query getVegaPeople {
    vegaPeople {
      id
      first_name
      last_name
      middle_name
      role {
        id
        name
        default_specialty_label
      }
    }
  }
`

export const GET_VEGA_PRODUCTS_REGIMENS = gql`
  query getVegaProductsRegimens($input: QueryVegaProdRegInput) {
    vegaProductsRegimens(input: $input) {
      id
      product
      regimen
    }
  }
`

export const GET_VEGA_PRODUCTS = gql`
  query getVegaProducts {
    vegaProducts {
      id
      generic_name
      brand_name
      logo_link
      color
      messaging
      regimens
    }
  }
`

export const GET_VEGA_REGIMENS = gql`
  query getVegaRegimens {
    vegaRegimens {
      id
      name
    }
  }
`

export const GET_MARKET_BASKETS_SURVEYS_QUESTIONS = gql`
  query getMarketBasketsSurveysQuestions($surveyId: ID) {
    marketBasketsSurveysQuestions(surveyId: $surveyId) {
      id
      survey
      category {
        id
        name
        prompt
        category_type
        _order
      }
      characteristic {
        id
        name
        description
      }
      answers {
        id
        rating
        stakeholder
        stakeholder_full {
          id
          first_name
          last_name
        }
      }
    }
  }
`

export const GET_MARKET_BASKETS_SURVEYS = gql`
  query getMarketBasketsSurveys($surveyId: ID, $marketBasketId: ID) {
    marketBasketsSurveys(surveyId: $surveyId, marketBasketId: $marketBasketId) {
      id
      market_basket
      stakeholders
      stakeholders_full {
        id
        first_name
        last_name
        middle_name
      }
      date
    }
  }
`

export const GET_MARKET_BASKETS_SURVEYS_STAKEHOLDERS = gql`
  query getMarketBasketsSurveysStakeholders($surveyId: ID) {
    marketBasketsSurveysStakeholders(surveyId: $surveyId) {
      id
      first_name
      last_name
      middle_name
      primary_state {
        id
        full_name
        abbreviation
        created_at
        updated_at
      }
      role {
        id
        name
        default_specialty_label
        type {
          id
          name
          created_at
          updated_at
        }
        created_at
        updated_at
      }
      role_specialties {
        id
        specialty_label
        person_role
        indication {
          id
          name
          regimens
          created_at
          updated_at
        }
        created_at
        updated_at
      }
      perception_tool_provider {
        id
        slug
        name
        name_tiny
        type
        state {
          id
          full_name
          abbreviation
          created_at
          updated_at
        }
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`

export const GET_MARKET_BASKETS_CATEGORIES = gql`
  query getMarketBasketsCategorires($marketBasketId: ID) {
    marketBasketsCategories(marketBasketId: $marketBasketId) {
      id
      name
      prompt
      category_type
      _order
      characteristics
      characteristics_full {
        id
        name
        description
      }
    }
  }
`

export const GET_MARKET_BASKETS = gql`
  query getMarketBaskets($marketBasketId: ID) {
    marketBaskets(marketBasketId: $marketBasketId) {
      id
      name
      description
      indication
      created_at
      updated_at
      products_regimens
      team_subscriptions
      categories {
        id
        name
        prompt
        category_type
        _order
        characteristics
        characteristics_full {
          id
          name
          description
        }
      }
    }
  }
`

export const GET_MARKET_BASKET_SURVEY_EXPORT_DATA = gql`
  query getMarketBasketSurveyExportData($surveyId: ID!) {
    marketBasketSurveyExportData(surveyId: $surveyId) {
      category_name
      characteristic_name
      first_name
      last_name
      category_type
      regimen_name
      product_brand_name
      product_generic_name
      manufacturer_name
      rating
      question_id
      answer_id
      person_id
      category_id
      characteristic_id
      regimen_id
      product_id
      manufacturer_id
      primary_role
      primary_role_type
    }
  }
`

export const GET_LISTS_CONFIG = gql`
  query getListsConfig($dashboardTool: String) {
    listsConfig(dashboardTool: $dashboardTool) {
      _id
      listId
      nodeId
      listTitle
      listInfo
      meta {
        location
        note
        type
      }
      dashboardTool
      labelKeys {
        labelKey
        labelName
        labelInfo
        valueWrapperType
      }
      createdOn
    }
  }
`

export const GET_MARKET_BASKETS_SUBSCRIPTIONS = gql`
  query getMarketsBaskets($clientTeamId: ID) {
    marketBasketsSubscriptions(clientTeamId: $clientTeamId) {
      id
      team
      market_basket
      created_at
      updated_at
    }
  }
`

export const GET_EVENTS = gql`
  query getEvents {
    events {
      _id
      userId
      username
      action
      entity
      timestamp
      boName
      connectedEntities {
        entity
        boName
      }
      deltas {
        field
        before
        after
      }
      metaType
    }
  }
`

export const GET_US_STATES = gql`
  query getUsStates {
    usStates {
      _id
      state
      stateLong
      status
      booksImpacted
      law
      lawLink
      bill
      surveyCommercialLivesPercentInsured
    }
  }
`

export const GET_VEGA_STATES = gql`
  query getVegaStates {
    vegaStates {
      id
      full_name
      abbreviation
      created_at
      updated_at
    }
  }
`

export const GET_OPEN_PAYMENTS = gql`
  query getOpenPayments($physicianProfileId: Float) {
    openPayments(physicianProfileId: $physicianProfileId) {
      dateOfPayment
      totalAmountOfPaymentUsdollars
      applicableManufacturerOrApplicableGpoMakingPaymentName
      productCategoryOrTherapeuticArea1
      nameOfDrugOrBiologicalOrDeviceOrMedicalSupply1
      productCategoryOrTherapeuticArea2
      nameOfDrugOrBiologicalOrDeviceOrMedicalSupply2
      productCategoryOrTherapeuticArea3
      nameOfDrugOrBiologicalOrDeviceOrMedicalSupply3
      productCategoryOrTherapeuticArea4
      nameOfDrugOrBiologicalOrDeviceOrMedicalSupply4
      natureOfPaymentOrTransferOfValue
      recipientPrimaryBusinessStreetAddressLine1
      recipientPrimaryBusinessStreetAddressLine2
      recipientCity
      recipientState
      recipientZipCode
      physicianPrimaryType
      physicianSpecialty
    }
  }
`

export const GET_PHYSICIANS_COMPARE = gql`
  query getPhysiciansCompare($npi: Float) {
    physiciansCompare(npi: $npi) {
      firstName
      middleName
      lastName
      pacId
      professionalEnrollmentId
      primarySpecialty
      secondarySpecialty1
      secondarySpecialty2
      secondarySpecialty3
      secondarySpecialty4
      secondarySpecialtyAll
      orgLegalName
      groupPracticePacId
      address1
      address2
      city
      state
      zip
      hospitalAffilLbn1
      hospitalAffilLbn2
      hospitalAffilLbn3
      hospitalAffilLbn4
      hospitalAffilLbn5
    }
  }
`

export const GET_PEOPLE = gql`
  query getPeople {
    people {
      _id
      createdOn
      updatedOn
      firstName
      lastName
      middleName
      affiliation
      affiliationPosition
      primaryState
      email
      linkedIn
      externalLink
      nationalProviderIdentifier
      physicianProfileId
    }
  }
`

export const GET_VEGA_PEOPLE_ROLES = gql`
  query getVegaPeopleRoles {
    vegaPeopleRoles {
      id
      name
      default_specialty_label
      type {
        id
        name
        created_at
        updated_at
      }
      people
      indication_specialties
      created_at
      updated_at
    }
  }
`

export const GET_VEGA_PEOPLE_ROLES_INDICATIONS = gql`
  query getVegaPeopleRolesIndications(
    $roleId: ID
    $indicationId: ID
    $personId: ID
  ) {
    vegaPeopleRolesIndications(
      roleId: $roleId
      indicationId: $indicationId
      personId: $personId
    ) {
      id
      specialty_label
      person_role
      indication {
        id
        name
        regimens
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`

export const GET_VEGA_PEOPLE_ROLES_TYPES = gql`
  query getVegaPeopleRolesTypes {
    vegaPeopleRolesTypes {
      id
      name
      created_at
      updated_at
    }
  }
`

export const GET_DEV_PATHWAYS_INFLUENCERS = gql`
  query getDevPathwaysInfluencers {
    DEV_pathwaysInfluencers
  }
`

export const GET_DEV_PROVIDER_INFLUENCERS = gql`
  query getDevProviderInfluencers {
    DEV_providerInfluencers
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
      icon
    }
  }
`

export const GET_USERS = gql`
  query getUsers($teamId: String, $clientId: String, $subscriptionId: String) {
    users(
      teamId: $teamId
      clientId: $clientId
      subscriptionId: $subscriptionId
    ) {
      _id
      firstName
      lastName
      username
      email
      client {
        _id
        name
        description
        icon
      }
    }
  }
`

export const GET_USER_TEAMS = gql`
  query getUserTeams($userId: String) {
    teams(userId: $userId) {
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

export const GET_TEAMS = gql`
  query getAllTeams($clientId: String) {
    teams(clientId: $clientId) {
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
  }
`

export const GET_SOURCE_INDICATIONS = gql`
  query getSourceIndications {
    indications {
      _id
      name
      uuid
      therapeuticAreaId
      regimens {
        _id
        name
        uuid
        products {
          _id
          nameGeneric
          nameBrand
          uuid
          tags
        }
      }
    }
  }
`

export const GET_VEGA_INDICATIONS = gql`
  query getVegaIndications {
    vegaIndications {
      id
      name
      regimens
      created_at
      updated_at
    }
  }
`

export const GET_THERAPEUTIC_AREAS = gql`
  query getTherapeuticAreas {
    therapeuticAreas {
      _id
      name
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
        uuid
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
      uuid
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

export const GET_VEGA_PROVIDERS = gql`
  query getVegaProviders {
    vegaProviders {
      id
      slug
      name
      name_tiny
      type
      institutions {
        id
        name
        created_at
        updated_at
      }
      community_practice_network {
        id
        name
        created_at
        updated_at
      }
      state {
        id
        full_name
        abbreviation
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`

export const GET_INSTITUTIONS = gql`
  query getVegaInstitutions {
    vegaInstitutions {
      id
      name
      created_at
      updated_at
    }
  }
`

export const GET_COMMUNITY_PRACTICE_NETWORKS = gql`
  query getVegaCommunityPracticeNetworks {
    vegaCommunityPracticeNetworks {
      id
      name
      created_at
      updated_at
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
      description
    }
  }
`

export const GET_LBM_SERVICES = gql`
  query getLbmServices {
    lbmServices {
      _id
      name
      description
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

export const GET_LBM_SERVICES_CATEGORIES = gql`
  query getLbmServicesCategories {
    lbmServicesCategories {
      _id
      name
    }
  }
`

export const GET_OBM_TYPES = gql`
  query getObmTypes {
    obmTypes {
      _id
      name
      description
    }
  }
`

export const GET_LBM_TYPES = gql`
  query getLbmTypes {
    lbmTypes {
      _id
      name
      description
    }
  }
`

export const GET_OBM_KEY_EVENTS = gql`
  query getObmKeyEvents($obmId: String) {
    obmKeyEvents(obmId: $obmId) {
      _id
      obmId
      date
      title
      description
      link
      internalTdgNote
    }
  }
`

export const GET_LBM_KEY_EVENTS = gql`
  query getLbmKeyEvents($lbmId: String) {
    lbmKeyEvents(lbmId: $lbmId) {
      _id
      lbmId
      date
      title
      description
      link
      internalTdgNote
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
      approvalTime
      hasDecisionSupport
      hasPbMbAuthorization
      isEmrIntegrable
      medicalReview
      treatmentSelection
      payer
      pharmacyBenefitManager
      specialtyPharmacy
      labBenefitManager
      parentCompany
    }
  }
`

export const GET_LBM_ORGANIZATIONS = gql`
  query getLbmOrganizations {
    lbmOrganizations {
      _id
      slug
      organization
      organizationTiny
      type
      start
      businessModel
      approvalTime
      hasDecisionSupport
      hasPbMbAuthorization
      isEmrIntegrable
      medicalReview
      treatmentSelection
      payer
      pharmacyBenefitManager
      specialtyPharmacy
      oncologyBenefitManager
      parentCompany
    }
  }
`

export const GET_DEV_COLLECTION_NAMES = gql`
  query getDevCollectionNames {
    collections(type: "dev")
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
      status
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
      status
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

export const GET_JOIN_OBMS_SERVICES_AND_OBMS_SERVICES_CATEGORIES = gql`
  query getJoinObmsServicesAndObmsServicesCategories($obmServiceId: String) {
    JOIN_obmsServices_obmsServicesCategories(obmServiceId: $obmServiceId) {
      _id
      obmServiceId
      obmServiceCategoryId
    }
  }
`

export const GET_JOIN_LBMS_SERVICES_AND_LBMS_SERVICES_CATEGORIES = gql`
  query getJoinLbmsServicesAndLbmsServicesCategories($lbmServiceId: String) {
    JOIN_lbmsServices_lbmsServicesCategories(lbmServiceId: $lbmServiceId) {
      _id
      lbmServiceId
      lbmServiceCategoryId
    }
  }
`

export const GET_JOIN_OBMS_AND_OBMS_SERVICES = gql`
  query getJoinObmsAndObmsServices($obmId: String) {
    JOIN_obms_obmsServices(obmId: $obmId) {
      _id
      obmId
      obmServiceId
      rating
    }
  }
`

export const GET_JOIN_LBMS_AND_LBMS_SERVICES = gql`
  query getJoinLbmsAndLbmsServices($lbmId: String) {
    JOIN_lbms_lbmsServices(lbmId: $lbmId) {
      _id
      lbmId
      lbmServiceId
      rating
    }
  }
`

export const GET_JOIN_OBMS_AND_OBMS_TYPES = gql`
  query getJoinObmsAndObmsTypes($obmId: String) {
    JOIN_obms_obmsTypes(obmId: $obmId) {
      _id
      obmId
      obmTypeId
    }
  }
`

export const GET_JOIN_LBMS_AND_LBMS_TYPES = gql`
  query getJoinLbmsAndLbmsTypes($lbmId: String) {
    JOIN_lbms_lbmsTypes(lbmId: $lbmId) {
      _id
      lbmId
      lbmTypeId
    }
  }
`

export const GET_JOIN_OBMS_AND_PEOPLE = gql`
  query getJoinObmsAndPeople {
    JOIN_obms_people {
      _id
      obmId
      personId
      position
      managementTypes
    }
  }
`

export const GET_JOIN_LBMS_AND_PEOPLE = gql`
  query getJoinLbmsAndPeople {
    JOIN_lbms_people {
      _id
      lbmId
      personId
      position
      managementTypes
    }
  }
`

export const GET_JOIN_OBMS_AND_PAYERS = gql`
  query getJoinObmsAndPayers($obmId: ID) {
    JOIN_obms_payers(obmId: $obmId) {
      _id
      obmId
      payerId
      books
      note
    }
  }
`

export const GET_JOIN_LBMS_AND_PAYERS = gql`
  query getJoinLbmsAndPayers($lbmId: ID) {
    JOIN_lbms_payers(lbmId: $lbmId) {
      _id
      lbmId
      payerId
      books
      note
    }
  }
`

export const GET_VIEW_OBM_SERVICES = gql`
  query getViewObmServices {
    VIEW_obmServices {
      _id
      obmId
      serviceId
      serviceCategoryId
      organization
      serviceCategory
      service
      serviceRating
    }
  }
`

export const GET_VIEW_LBM_SERVICES = gql`
  query getViewLbmServices {
    VIEW_lbmServices {
      _id
      lbmId
      serviceId
      serviceCategoryId
      organization
      serviceCategory
      service
      serviceRating
    }
  }
`

export const GET_VIEW_OBM_PAYER_PARTNERSHIPS = gql`
  query getViewObmPayerPartnerships {
    VIEW_obmPayerPartnerships {
      _id
      obmId
      obmOrganization
      payerId
      payerSlug
      payerOrganization
      commercialMedicalLives
      commercialMedicalLivesPercent
      commercialReach
      medicareMedicalLives
      medicareMedicalLivesPercent
      medicareReach
      managedMedicaidMedicalLives
      managedMedicaidMedicalLivesPercent
      managedMedicaidReach
    }
  }
`

export const GET_VIEW_LBM_PAYER_PARTNERSHIPS = gql`
  query getViewLbmPayerPartnerships {
    VIEW_lbmPayerPartnerships {
      _id
      lbmId
      lbmOrganization
      payerId
      payerSlug
      payerOrganization
      commercialMedicalLives
      commercialMedicalLivesPercent
      commercialReach
      medicareMedicalLives
      medicareMedicalLivesPercent
      medicareReach
      managedMedicaidMedicalLives
      managedMedicaidMedicalLivesPercent
      managedMedicaidReach
    }
  }
`

export const GET_VIEW_OBM_INFLUENCERS = gql`
  query getViewObmInfluencers {
    VIEW_obmInfluencers {
      _id
      obmId
      obmOrganization
      influencerPosition
      influencerId
      influencerFirstName
      influencerLastName
      influencerNpiNumber
    }
  }
`

export const GET_VIEW_LBM_INFLUENCERS = gql`
  query getViewLbmInfluencers {
    VIEW_lbmInfluencers {
      _id
      lbmId
      lbmOrganization
      influencerPosition
      influencerId
      influencerFirstName
      influencerLastName
      influencerNpiNumber
    }
  }
`

export const GET_END_USER_TERMS_LINK = gql`
  query getEndUserTermsLink {
    endUserTermsLink {
      _id
      link
      agreementDate
    }
  }
`

export const GET_END_USER_TERMS_USERS = gql`
  query getEndUserTermsUsers {
    endUserTermsUsers {
      _id
      endUserTerms {
        agreed
        timestamp
      }
    }
  }
`

export const GET_DEV_TO_PROD_PUSH_CONFIGS = gql`
  query getDevToProdPushConfigs {
    devToProdPushConfigs {
      _id
      name
      collections
    }
  }
`

export const GET_ORGANIZATION_TYPES = gql`
  query getOrganizationTypes {
    organizationTypes
  }
`

export const GET_JOIN_PATHWAYS_AND_PEOPLE = gql`
  query getJoinPathwaysAndPeople {
    JOIN_pathways_people {
      _id
      personId
      pathwaysId
      indicationIds
      pathwaysInfluencerTypes
      tumorTypeSpecialty
      internalFields {
        internalNotes
        pathwaysManagementTypes
        valueChairsIndications
      }
      position
      priority
      alert {
        date
        type
        description
      }
      exclusionSettings {
        isExcluded
        reason
      }
      startDate
      endDate
      startQuarter
      endQuarter
      updatedOn
      createdOn
    }
  }
`
