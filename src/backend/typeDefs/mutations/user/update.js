const { gql } = require('apollo-server-express')

const updateUserTypeDefs = gql`
  input UpdateUserInput {
    _id: ID!
    username: String!
    email: String!
    password: String
    roles: [ID!]!
    emailSubscriptions: [SubscriptionInput]
    defaultLanding: DefaultLandingInput
  }

  type UpdateUserPayload {
    _id: ID!
    username: String
    email: String
    password: String
    emailSubscriptions: [Subscription]
    defaultLanding: DefaultLanding
  }
`

module.exports = updateUserTypeDefs
