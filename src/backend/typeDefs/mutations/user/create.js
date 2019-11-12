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
  }

  input SubscriptionInput {
    _id: ID!
    type: String!
  }

  type CreateUserPayload {
    _id: ID!
    username: String!
    email: String
    emailSubscriptions: [Subscription]
  }
`

module.exports = createUserTypeDefs
