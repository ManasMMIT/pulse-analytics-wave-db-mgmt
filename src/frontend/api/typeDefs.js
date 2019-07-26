import gql from 'graphql-tag'

const typeDefs = gql`
  type Query {
    clients: [Client],
    teams: [Team],
    users: [User],
    selectedClient: Client,
    selectedTeam: Team,
    selectedUser: User,
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
  }

  type User {
    id: String
    username: String
    email: String
  }

  # extend type Mutation {
  #   addOrRemoveFromCart(id: ID!): [Launch]
  # }
`

  export default typeDefs
