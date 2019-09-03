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
    _id: String
    name: String
    description: String
  }

  type Team {
    _id: String
    name: String
    description: String
    isDefault: Boolean
  }

  type User {
    _id: String
    username: String
    email: String
  }

  type Sitemap {
    _id: String
    tools: JSON
    dashboards: JSON
    pages: JSON
    cards: JSON
  }

  input SitemapInput {
    _id: String
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
