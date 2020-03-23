const { gql } = require('apollo-server-express')

const queries = gql`
  type Query {
    nodes(parentId: String, type: String): [Node]
    clients(_id: String): [Client]
    teams(clientId: String, userId: String): [Team]
    users(
      teamId: String,
      clientId: String,
      subscriptionId: String
    ): [User]
    indications: [Indication]
    products: [Product]
    regimens: [Regimen]

    providerOrganizations: [ProviderOrganization]
    payerOrganizations: [PayerOrganization]
    pathwaysOrganizations: [PathwaysOrganization]
    apmOrganizations: [ApmOrganization]

    qualityOfAccessScores: [QualityOfAccessScore]
    collections(type: String): [String]
    newTreatmentPlans(data: JSON): JSON

    testEmailGroups: [TestEmailGroup]

    alert(_id: ID): Alert

    organizationMeta(_ids: [ID]): [OrganizationMeta]

    opLogs: [OpLog]

    workbooks: [Workbook]
    bomSchema(boId: ID): JSON

    singlePayerProject(projectId: ID): SinglePayerProject
    payerProjectsList: [PayerProjectsList]
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
  }

  type Team {
    _id: String!
    name: String!
    description: String!
    isDefault: Boolean
    sitemap: JSON
    client: Client
    resources: JSON
  }

  type User {
    _id: String
    username: String
    email: String
    client: Client
    emailSubscriptions: [Subscription]
  }

  type Subscription {
    _id: ID!
    type: String!
  }

  type Indication {
    _id: ID!
    name: String
    regimens: [Regimen]
  }

  type Product {
    _id: ID!
    nameGeneric: String
    nameBrand: String
    tags: [String]
  }

  type Regimen {
    _id: ID!
    name: String!
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
`

module.exports = [
  queries,
]
