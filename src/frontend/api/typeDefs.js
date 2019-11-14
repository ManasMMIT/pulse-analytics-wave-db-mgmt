import gql from 'graphql-tag'

const typeDefs = gql`
  type Query {
    clients: [Client],
    teams: [Team],
    users: [User],
    selectedClient: Client,
    selectedTeam: Team,
    selectedUser: User,
    stagedSitemap: Sitemap,
  }

  type Client {
    _id: String # why not ID type?
    name: String
    description: String
  }

  type Team {
    _id: String # why not ID type?
    name: String
    description: String
    isDefault: Boolean
    client: Client
    sitemap: Sitemap
  }

  type User {
    _id: String # why not ID type?
    username: String
    email: String
    emailSubscriptions: [Subscription]
    client: Client
  }

  type Subscription {
    _id: ID
    type: String
  }

  type Sitemap {
    _id: String # why not ID type?
    tools: JSON
    dashboards: JSON
    pages: JSON
    cards: JSON
  }

  input SitemapInput {
    _id: String # why not ID type?
    tools: JSON
    dashboards: JSON
    pages: JSON
    cards: JSON
  }

  # extend type Mutation {
  #   addOrRemoveFromCart(id: ID!): [Launch]
  # }
`

  export default typeDefs
