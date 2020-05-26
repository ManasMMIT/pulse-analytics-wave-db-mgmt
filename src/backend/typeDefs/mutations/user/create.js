const { gql } = require('apollo-server-express')

const createUserTypeDefs = gql`
  input CreateUserInput {
    _id: ID # re-using the update form sends { _id: null } through
    username: String!
    email: String!
    password: String!
    clientId: String!
    roles: [ID!]!
    emailSubscriptions: [SubscriptionInput]
    defaultLanding: DefaultLandingInput
  }

  input SubscriptionInput {
    _id: ID!
    type: String!
  }

  input DefaultLandingInput {
    path: String!
    locked: Boolean!
  }

  type CreateUserPayload {
    _id: ID!
    username: String!
    email: String
    emailSubscriptions: [Subscription]
    defaultLanding: DefaultLanding
  }
`

module.exports = createUserTypeDefs
