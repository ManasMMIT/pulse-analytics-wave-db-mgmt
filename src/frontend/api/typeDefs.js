import gql from 'graphql-tag'

const typeDefs = gql`
  type Query {
    clients: [Client],
    teams: [Team],
    users: [User],
    selectedClient: Client,
    selectedTeam: Team,
    selectedUser: User,
    sitemap: Sitemap,
  }

  type Client {
    id: String
    name: String
    description: String
  }

  type Team {
    id: String
    name: String
    description: String
    isDefault: Boolean
  }

  type User {
    id: String
    username: String
    email: String
    roles: [Team]
  }

  type Sitemap {
    id: String
    name: String
    kids: JSON
  }

  # extend type Mutation {
  #   addOrRemoveFromCart(id: ID!): [Launch]
  # }
`

  export default typeDefs
