const { gql } = require('apollo-server-express')

const queries = gql`
  type Query {
    listsConfig(dashboardTool: String): [ListsConfig!]!

    marketBaskets(marketBasketId: ID): [MarketBasket!]!
    marketBasketsSubscriptions: [MarketBasketSubscription!]!
    marketBasketsCategories(marketBasketId: ID): [MarketBasketCategory!]!
    marketBasketsSurveysStakeholders(surveyId: ID): [VegaPerson!]!
    marketBasketSurveyExportData(
      surveyId: ID!
    ): [MarketBasketSurveyExportDatum!]!
    marketBasketsSurveys(
      surveyId: ID
      marketBasketId: ID
    ): [MarketBasketSurvey!]!
    marketBasketsSurveysQuestions(surveyId: ID): [MarketBasketSurveyQuestion!]!

    nodes(parentId: String, type: String): [Node]

    clients(_id: String): [Client!]!

    teams(clientId: String, userId: String): [Team!]!

    users(teamId: String, clientId: String, subscriptionId: String): [User!]!

    indications: [Indication]
    vegaIndications: [VegaIndication!]!
    therapeuticAreas: [TherapeuticArea]
    products: [Product]
    vegaProducts: [VegaProduct]
    vegaProductsRegimens(input: QueryVegaProdRegInput): [VegaProductRegimens]
    regimens: [Regimen]
    vegaRegimens: [VegaRegimen]

    vegaProviders: [VegaProvider!]!
    vegaInstitutions: [VegaInstitution!]!
    vegaCommunityPracticeNetworks: [VegaCommunityPracticeNetwork!]!

    organizationTypes: [String]

    providerOrganizations: [ProviderOrganization]
    payerOrganizations: [PayerOrganization]
    pathwaysOrganizations: [PathwaysOrganization]
    apmOrganizations: [ApmOrganization]

    obmOrganizations: [ObmOrganization]
    lbmOrganizations: [LbmOrganization]

    obmServices: [ObmService]
    lbmServices: [LbmService]

    obmServicesCategories: [ObmServiceCategory]
    lbmServicesCategories: [LbmServiceCategory]

    obmTypes: [ObmType]
    lbmTypes: [LbmType!]!

    obmKeyEvents(obmId: String): [ObmKeyEvent!]!
    lbmKeyEvents(lbmId: String): [LbmKeyEvent!]!

    JOIN_obmsServices_obmsServicesCategories(
      obmServiceId: String
    ): [ObmServiceAndObmServiceCategoryConnection]

    JOIN_lbmsServices_lbmsServicesCategories(
      lbmServiceId: String
    ): [LbmServiceAndLbmServiceCategoryConnection]

    JOIN_obms_obmsServices(obmId: String): [ObmAndObmServiceConnection]
    JOIN_lbms_lbmsServices(lbmId: String): [LbmAndLbmServiceConnection]

    JOIN_obms_obmsTypes(obmId: String): [ObmAndObmTypeConnection]
    JOIN_lbms_lbmsTypes(lbmId: String): [LbmAndLbmTypeConnection]

    JOIN_obms_people: [ObmAndPersonConnection]
    JOIN_lbms_people: [LbmAndPersonConnection]

    JOIN_obms_payers(obmId: ID): [ObmAndPayerConnection]
    JOIN_lbms_payers(lbmId: ID): [LbmAndPayerConnection]

    VIEW_obmServices: [VIEW_ObmService]
    VIEW_lbmServices: [VIEW_LbmService]

    VIEW_obmPayerPartnerships: [VIEW_ObmPayerPartnership]
    VIEW_lbmPayerPartnerships: [VIEW_LbmPayerPartnership]

    VIEW_obmInfluencers: [VIEW_ObmInfluencer]
    VIEW_lbmInfluencers: [VIEW_LbmInfluencer]

    JOIN_pathways_people: [PathwaysAndPersonConnection]

    qualityOfAccessScores: [QualityOfAccessScore]

    collections(type: String): [String]

    devToProdPushConfigs: [DevToProdPushConfig!]!

    newTreatmentPlans(data: JSON): JSON

    testEmailGroups: [TestEmailGroup]

    alert(_id: ID): Alert

    organizationMeta(_ids: [ID]): [OrganizationMeta]

    opLogs: [OpLog]
    fullOpLogs(maxLineCount: Int): [OpLog]

    workbooks: [Workbook]

    bomConfigs: [BomConfig]
    bomSchema(boId: ID): JSON
    businessObjects: [BusinessObject]

    aquilaConfigs: [AquilaConfig]!
    aquilaPqlResults(pql: String!): JSON
    aquilaBusinessObjects: [AquilaBusinessObject]
    aquilaBoFilterSettings(boId: ID!): BoFilterSettings

    singlePayerProject(projectId: String): SinglePayerProject
    payerProjectsList: [PayerProjectsList]

    payerProjectPtps(input: PayerProjectPtpsInput!): [PayerProjectPtp]
    payerProjectPtpsImportTimestamps(projectId: ID!): PtpsImportTimestamps

    treatmentPlans: [TreatmentPlan]

    books: [Book]

    coverages: [Coverage]

    lines: [Line]

    populations: [Population]

    regionalTargetingData(input: JSON): JSON

    cMsOrgPrimarySpecialtyCounts(orgPacId: String): JSON

    people: [Person]
    vegaPeople: [VegaPerson!]!

    vegaPeopleRoles: [VegaPersonRole!]!
    vegaPeopleRolesIndications(
      roleId: ID
      indicationId: ID
      personId: ID
    ): [VegaPersonRoleIndication!]!
    vegaPeopleRolesTypes: [VegaPersonRoleType!]!

    DEV_pathwaysInfluencers: JSON # grabbing sheet data directly from dev. type def is in wave-api
    DEV_providerInfluencers: JSON # grabbing sheet data directly from dev. type def is in wave-api
    physiciansCompare(npi: Float): [PhysiciansCompareDatum]
    openPayments(physicianProfileId: Float): [OpenPaymentDatum]

    endUserTermsLink: EndUserTermsLink
    endUserTermsUsers: [EndUserTermsUser]

    usStates: [UsState]
    vegaStates: [VegaState!]!

    events: [Event]
  }

  input ListsConfigInput {
    dashboardTool: String
  }

  type MetaListsConfig {
    location: String
    note: String
    type: String
  }

  type LabelKeyListsConfig {
    labelKey: String
    labelName: String
    labelInfo: String
    valueWrapperType: String
  }

  type ListsConfig {
    _id: ID!
    listId: String
    nodeId: ID
    listTitle: String
    listInfo: String
    meta: MetaListsConfig
    dashboardTool: String
    labelKeys: [LabelKeyListsConfig]!
    createdOn: DateTime
  }

  input QueryVegaProdRegInput {
    productId: ID
  }

  type MarketBasket {
    id: ID!
    name: String
    description: String
    indication: JSON
    created_at: DateTime
    updated_at: DateTime
    products_regimens: JSON
    team_subscriptions: JSON
    categories: [MarketBasketCategory!]
  }

  type DevMarketBasket {
    _id: ID!
    name: String
    description: String
    productsRegimens: JSON
    categories: JSON
  }

  type MarketBasketSubscription {
    id: ID!
    team: ID
    market_basket: ID
    start_date: DateTime
    end_date: DateTime
    created_at: DateTime
    updated_at: DateTime
  }

  type MarketBasketCategory {
    id: ID!
    market_basket: ID
    name: String
    prompt: String
    category_type: String
    _order: Int
    characteristics: [ID!]
    characteristics_full: [MarketBasketCategoryCharacteristic!]
  }

  type MarketBasketCategoryCharacteristic {
    id: ID!
    name: String
    description: String
  }

  type MarketBasketSurveyExportDatum {
    first_name: String
    middle_name: String
    last_name: String

    category_name: String
    category_type: String
    characteristic_name: String

    regimen_name: String
    product_brand_name: String
    product_generic_name: String
    manufacturer_name: String

    question_id: ID
    answer_id: ID
    rating: Float

    person_id: ID
    category_id: ID
    characteristic_id: ID
    regimen_id: ID
    product_id: ID
    manufacturer_id: ID
    primary_role_type: String
    primary_role: String
  }

  type MarketBasketSurvey {
    id: ID!
    market_basket: ID
    stakeholders: [ID!]
    stakeholders_full: [VegaPerson!]
    date: DateTime
  }

  type MarketBasketSurveyHydrated {
    id: ID!
    date: DateTime
  }

  type MarketBasketStakeholder {
    id: ID!
    first_name: String
    last_name: String
  }

  type MarketBasketSurveyQuestionAnswer {
    id: ID!
    rating: Float
    stakeholder: ID
    stakeholder_full: MarketBasketStakeholder
  }

  type MarketBasketSurveyQuestion {
    id: ID!
    survey: ID
    category: MarketBasketCategory
    characteristic: MarketBasketCategoryCharacteristic
    answers: [MarketBasketSurveyQuestionAnswer!]
  }

  type Event {
    _id: ID!
    userId: String
    username: String
    action: String
    timestamp: DateTime
    entity: JSON
    boName: String
    connectedEntities: [ConnectedEntity]
    deltas: [FieldDelta]
    metaType: String
  }

  type ConnectedEntity {
    entity: JSON
    boName: String
  }

  type FieldDelta {
    field: String
    before: JSON
    after: JSON
  }

  type UsState {
    _id: ID!
    state: String
    stateLong: String
    status: String
    booksImpacted: [String]
    law: String
    lawLink: String
    bill: String
    surveyCommercialLivesPercentInsured: Float
  }

  type VegaState {
    id: ID!
    full_name: String
    abbreviation: String
    created_at: DateTime
    updated_at: DateTime
  }

  type OpenPaymentDatum {
    dateOfPayment: String
    totalAmountOfPaymentUsdollars: Float
    applicableManufacturerOrApplicableGpoMakingPaymentName: String
    productCategoryOrTherapeuticArea1: String
    nameOfDrugOrBiologicalOrDeviceOrMedicalSupply1: String
    productCategoryOrTherapeuticArea2: String
    nameOfDrugOrBiologicalOrDeviceOrMedicalSupply2: String
    productCategoryOrTherapeuticArea3: String
    nameOfDrugOrBiologicalOrDeviceOrMedicalSupply3: String
    productCategoryOrTherapeuticArea4: String
    nameOfDrugOrBiologicalOrDeviceOrMedicalSupply4: String
    natureOfPaymentOrTransferOfValue: String
    recipientPrimaryBusinessStreetAddressLine1: String
    recipientPrimaryBusinessStreetAddressLine2: String
    recipientCity: String
    recipientState: String
    recipientZipCode: String
    physicianPrimaryType: String
    physicianSpecialty: String
  }

  type PhysiciansCompareDatum {
    firstName: String
    middleName: String
    lastName: String
    pacId: String
    professionalEnrollmentId: String
    primarySpecialty: String
    secondarySpecialty1: String
    secondarySpecialty2: String
    secondarySpecialty3: String
    secondarySpecialty4: String
    secondarySpecialtyAll: String
    orgLegalName: String
    groupPracticePacId: String
    address1: String
    address2: String
    city: String
    state: String
    zip: String
    hospitalAffilLbn1: String
    hospitalAffilLbn2: String
    hospitalAffilLbn3: String
    hospitalAffilLbn4: String
    hospitalAffilLbn5: String
  }

  type Person {
    _id: ID!
    createdOn: DateTime
    updatedOn: DateTime
    firstName: String
    lastName: String
    middleName: String
    affiliation: String
    affiliationPosition: String
    primaryState: String
    email: String
    linkedIn: String
    externalLink: String
    nationalProviderIdentifier: Float
    physicianProfileId: Float
  }

  type VegaIndication {
    id: ID!
    name: String
    regimens: [ID!]
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaPersonRoleIndication {
    id: ID!
    specialty_label: String
    person_role: ID
    indication: VegaIndication
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaPersonRoleType {
    id: ID!
    name: String
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaPersonRole {
    id: ID!
    name: String
    default_specialty_label: String
    type: VegaPersonRoleType
    people: [ID!]
    indication_specialties: [ID!]
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaInstitution {
    id: ID!
    name: String
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaCommunityPracticeNetwork {
    id: ID!
    name: String
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaProvider {
    id: ID!
    slug: String
    name: String
    name_tiny: String
    type: String
    institutions: [VegaInstitution]
    community_practice_network: VegaCommunityPracticeNetwork
    state: VegaState
    created_at: DateTime
    updated_at: DateTime
  }

  type VegaPerson {
    id: ID!
    first_name: String
    last_name: String
    middle_name: String
    primary_state: VegaState
    role: VegaPersonRole
    role_specialties: [VegaPersonRoleIndication!]
    perception_tool_provider: VegaProvider
    created_at: DateTime
    updated_at: DateTime
  }

  type Node {
    _id: ID!
    name: String
    type: String
    componentPath: String
    text: JSON
    subtitle: String
    caption: String
    order: Int
    parentId: String
    schemaVersion: String
    resources: JSON
    icon: String # TODO: deprecate and change to iconId
  }

  type Client {
    _id: String
    name: String
    description: String
    icon: String
  }

  type Team {
    _id: String!
    name: String!
    uuid: String
    description: String!
    isDefault: Boolean
    sitemap: JSON
    client: Client
    resources: JSON
    defaultLandingPath: String
  }

  type User {
    _id: String
    firstName: String
    lastName: String
    username: String
    email: String
    client: Client
    emailSubscriptions: [Subscription]
    defaultLanding: DefaultLanding
  }

  type Subscription {
    _id: ID!
    type: String!
  }

  type DefaultLanding {
    path: String
    locked: Boolean
  }

  type Indication {
    _id: ID!
    name: String
    uuid: String
    regimens: [Regimen]
    therapeuticAreaId: String
  }

  type TherapeuticArea {
    _id: ID!
    name: String
  }

  type Product {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    uuid: String
    tags: [String]
  }

  type VegaProduct {
    id: ID!
    generic_name: String
    brand_name: String
    logo_link: String
    color: String
    messaging: String
    regimens: [ID!]!
  }

  type VegaProductRegimens {
    id: ID!
    product: JSON
    regimen: JSON
  }

  type VegaRegimen {
    id: ID!
    name: String
  }

  type Regimen {
    _id: ID!
    name: String!
    uuid: String
    products: [Product!]!
  }

  type QualityOfAccessScore {
    _id: ID!
    access: String
    accessTiny: String
    score: Int
    sortOrder: Int
    color: String
    caption: JSON
  }

  type ProviderOrganization {
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    providerCancerCenter: String # TODO: Change to just cancerCenter or create separate tool account typedefs
    connections: JSON
    state: String
    city: String
    oncologistsCount: Int
    sitesCount: Int
    groupPracticePacId: String
  }

  type PayerOrganization {
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    connections: JSON
  }

  type PathwaysOrganization {
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    connections: JSON
  }

  type ApmOrganization {
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    connections: JSON
  }

  type ObmOrganization {
    # base fields
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    start: Int
    businessModel: String

    # "technology" fields
    approvalTime: String
    hasDecisionSupport: Boolean
    hasPbMbAuthorization: Boolean
    isEmrIntegrable: Boolean
    medicalReview: String
    treatmentSelection: String

    # "vertical integration" fields that in the future should likely
    # be handled by org-to-org connections
    payer: String
    pharmacyBenefitManager: String
    specialtyPharmacy: String
    labBenefitManager: String
    parentCompany: String
  }

  type LbmOrganization {
    # base fields
    _id: ID!
    slug: String!
    type: String
    organization: String
    organizationTiny: String
    start: Int
    businessModel: String

    # "technology" fields
    approvalTime: String
    hasDecisionSupport: Boolean
    hasPbMbAuthorization: Boolean
    isEmrIntegrable: Boolean
    medicalReview: String
    treatmentSelection: String

    # "vertical integration" fields that in the future should likely
    # be handled by org-to-org connections
    payer: String
    pharmacyBenefitManager: String
    specialtyPharmacy: String
    oncologyBenefitManager: String
    parentCompany: String
  }

  type ObmService {
    _id: ID!
    name: String!
    description: String
  }

  type LbmService {
    _id: ID!
    name: String!
    description: String
  }

  type ObmServiceCategory {
    _id: ID!
    name: String!
  }

  type LbmServiceCategory {
    _id: ID!
    name: String!
  }

  type ObmType {
    _id: ID!
    name: String!
    description: String
  }

  type LbmType {
    _id: ID!
    name: String!
    description: String
  }

  type ObmServiceAndObmServiceCategoryConnection {
    _id: ID!
    obmServiceId: String!
    obmServiceCategoryId: String!
  }

  type LbmServiceAndLbmServiceCategoryConnection {
    _id: ID!
    lbmServiceId: String!
    lbmServiceCategoryId: String!
  }

  type ObmAndObmServiceConnection {
    _id: ID!
    obmId: String!
    obmServiceId: String!
    rating: Int!
  }

  type LbmAndLbmServiceConnection {
    _id: ID!
    lbmId: String!
    lbmServiceId: String!
    rating: Int!
  }

  type ObmAndObmTypeConnection {
    _id: ID!
    obmId: String!
    obmTypeId: String!
  }

  type LbmAndLbmTypeConnection {
    _id: ID!
    lbmId: String!
    lbmTypeId: String!
  }

  type ObmAndPersonConnection {
    _id: ID!
    obmId: ID!
    personId: ID!
    position: String
    managementTypes: [String!]
  }

  type LbmAndPersonConnection {
    _id: ID!
    lbmId: ID!
    personId: ID!
    position: String
    managementTypes: [String!]
  }

  type ObmAndPayerConnection {
    _id: ID!
    obmId: String!
    payerId: String!
    books: [JSON!]!
    note: String
  }

  type LbmAndPayerConnection {
    _id: ID!
    lbmId: String!
    payerId: String!
    books: [JSON!]!
    note: String
  }

  # TODO: can't use _id here because caching problems on frontend;
  # temporarily using JSON type for books
  # type ObmAndPayerConnectionBookObj {
  #   _id: ID!
  #   name: String!
  #   isNational: Boolean!
  #   states: [String!]!
  # }

  type ObmKeyEvent {
    _id: ID!
    obmId: String!
    date: Date
    title: String
    description: String
    link: String
    internalTdgNote: String
  }

  type LbmKeyEvent {
    _id: ID!
    lbmId: String!
    date: Date
    title: String
    description: String
    link: String
    internalTdgNote: String
  }

  type VIEW_ObmInfluencer {
    _id: ID!
    obmId: String!
    obmOrganization: String!
    influencerPosition: String
    influencerId: String!
    influencerFirstName: String!
    influencerLastName: String!
    influencerNpiNumber: Float
  }

  type VIEW_LbmInfluencer {
    _id: ID!
    lbmId: String!
    lbmOrganization: String!
    influencerPosition: String
    influencerId: String!
    influencerFirstName: String!
    influencerLastName: String!
    influencerNpiNumber: Float
  }

  type VIEW_ObmService {
    _id: ID!
    obmId: String!
    serviceId: String!
    serviceCategoryId: String
    organization: String!
    serviceCategory: String
    service: String!
    serviceRating: Int!
  }

  type VIEW_LbmService {
    _id: ID!
    lbmId: String!
    serviceId: String!
    serviceCategoryId: String
    organization: String!
    serviceCategory: String
    service: String!
    serviceRating: Int!
  }

  type VIEW_ObmPayerPartnership {
    _id: ID!
    obmId: String!
    obmOrganization: String!
    payerId: String!
    payerSlug: String!
    payerOrganization: String!
    commercialMedicalLives: Float
    commercialMedicalLivesPercent: Float
    commercialReach: String
    medicareMedicalLives: Float
    medicareMedicalLivesPercent: Float
    medicareReach: String
    managedMedicaidMedicalLives: Float
    managedMedicaidMedicalLivesPercent: Float
    managedMedicaidReach: String
  }

  type VIEW_LbmPayerPartnership {
    _id: ID!
    lbmId: String!
    lbmOrganization: String!
    payerId: String!
    payerSlug: String!
    payerOrganization: String!
    commercialMedicalLives: Float
    commercialMedicalLivesPercent: Float
    commercialReach: String
    medicareMedicalLives: Float
    medicareMedicalLivesPercent: Float
    medicareReach: String
    managedMedicaidMedicalLives: Float
    managedMedicaidMedicalLivesPercent: Float
    managedMedicaidReach: String
  }

  type VIEW_PathwaysInfluencer {
    _id: ID!
    pathwaysId: String!
    pathwaysOrganization: String!
    influencerId: String!
    influencerType: String
    influencerPosition: String
    influencerFirstName: String!
    influencerLastName: String!
    influencerMiddleName: String
    influencerNpiNumber: Float
    updatedOn: DateTime
  }

  type Connection {
    _id: ID!
    org: JSON # could be various shapes, depending on how much dupe org data we want here
    category: String!
    type: String!
    state: String
  }

  type EmailUser {
    client: String!
    username: String!
    email: String
    isPulseTest: Boolean
    isTdgTest: Boolean
  }

  type TestEmailGroup {
    _id: ID!
    name: String
    recipients: [String]
    usersToMock: [ID]
    emailSubscriptions: [ID]
  }

  type Alert {
    _id: ID!
    type: String
    date: Date
    description: String
  }

  type OrganizationMeta {
    _id: ID!
    accountId: ID
    exportedAt: DateTime
    exporter: JSON
    updatedAt: DateTime
    updater: JSON
  }

  type OpLog {
    timestamp: DateTime
    username: String
    userId: String
    operationName: String
    operationVariables: JSON
    status: String
  }

  type Workbook {
    _id: ID!
    name: String!
    sheets: [Sheet]!
  }

  type Sheet {
    _id: ID!
    name: String!
    fields: [Field]
    collection: String
  }

  type Field {
    _id: ID!
    name: String!
    type: String!
    oneOf: [String]
    businessObjRef: JSON # tried using BusinessObjRef but difficult to solve caching issue on frontend arises
  }

  # type BusinessObjRef {
  #   _id: String!
  #   fieldId: ID!
  # }

  type BomConfig {
    _id: ID!
    boId: ID!
    label: String!
    tags: [BomTag]!
  }

  type BomTag {
    _id: ID!
    label: String!
    sections: [BomSection]!
  }

  type BomSection {
    _id: ID!
    label: String!
    fields: [BomField]!
  }

  type BomField {
    _id: ID!
    boFieldId: ID!
    label: String!
    inputComponent: String!
    inputProps: JSON # highly variable structure
  }

  type BusinessObject {
    _id: ID!
    name: String
    sourceCollection: SourceCollectionSubDoc
    fields: [BoField]
  }

  type SourceCollectionSubDoc {
    collection: String
    query: JSON
  }

  type BoField {
    _id: ID!
    key: String
    type: String
  }

  type BoFilterSettings {
    _id: ID!
    label: String
    fields: [BoFilterSettingsField]
  }

  type BoFilterSettingsField {
    _id: ID
    boFieldId: ID
    boFieldKey: String
    inputProps: JSON # too dynamic to track all props
    label: String
  }

  type AquilaBusinessObject {
    _id: ID!
    boId: ID!
    boName: String
    label: String
  }

  type AquilaConfig {
    _id: ID!
    boId: ID!
    label: String!
    fields: [AquilaConfigField]!
  }

  type AquilaConfigField {
    _id: ID!
    boFieldId: ID!
    label: String!
    inputProps: JSON # highly variable structure
  }

  type PtpsImportTimestamps {
    timestamps: [DateTime]
  }

  type SinglePayerProject {
    _id: ID!
    name: String!
    timestamps: [DateTime]
  }

  type PayerProjectsList {
    _id: ID!
    name: String!
  }

  type TreatmentPlan {
    _id: ID!
    indication: String
    regimen: String
    book: String
    coverage: String
    line: String
    population: String
  }

  type Book {
    _id: ID!
    name: String
  }

  type Coverage {
    _id: ID!
    name: String
  }

  type Population {
    _id: ID!
    name: String
  }

  type Line {
    _id: ID!
    name: String
  }

  type PayerProjectPtp {
    _id: ID!
    organizationId: ID
    treatmentPlanId: ID
    slug: String
    organization: String
    organizationTiny: String
    indication: String
    population: String
    line: String
    regimen: String
    book: String
    coverage: String
    project: String
  }

  type EndUserTermsLink {
    _id: ID!
    link: String
    agreementDate: DateTime
  }

  type EndUserTermsUser {
    _id: ID!
    endUserTerms: EndUserTermsAgreement
  }

  type EndUserTermsAgreement {
    agreed: Boolean
    timestamp: DateTime
  }

  input PayerProjectPtpsInput {
    projectId: ID!
  }

  input OrderConfig {
    key: String!
    direction: Int!
  }

  type DevToProdPushConfig {
    _id: ID!
    name: String
    collections: [String!]!
  }

  type PathwaysAndPersonConnection {
    _id: ID
    createdOn: DateTime
    updatedOn: DateTime
    personId: String!
    pathwaysId: String!
    indicationIds: [String!]!
    pathwaysInfluencerTypes: [String!]!
    tumorTypeSpecialty: String
    internalFields: PathwaysAndPersonConnectionInternalFields!
    position: String
    priority: String
    alert: PathwaysAndPersonConnectionAlert!
    exclusionSettings: PathwaysAndPersonExclusionSettings!
    startDate: Date # will return ISO short instead of DateTime returning ISO long -- but will timezone be an issue?
    endDate: Date # will return ISO short instead of DateTime returning ISO long  -- but will timezone be an issue?
    startQuarter: Date # will return ISO short instead of DateTime returning ISO long -- but will timezone be an issue?
    endQuarter: Date # will return ISO short instead of DateTime returning ISO long  -- but will timezone be an issue?
  }

  type PathwaysAndPersonConnectionInternalFields {
    internalNotes: String
    pathwaysManagementTypes: [String!]!
    valueChairsIndications: [String!]!
  }

  type PathwaysAndPersonConnectionAlert {
    date: Date # will return ISO short instead of DateTime returning ISO long -- but will timezone be an issue?
    type: String
    description: String
  }

  type PathwaysAndPersonExclusionSettings {
    isExcluded: Boolean
    reason: String
  }
`

module.exports = [queries]
