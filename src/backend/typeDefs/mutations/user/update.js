const { gql } = require('apollo-server-express')

const updateUserTypeDefs = gql`
  input UpdateUserInput {
    _id: ID!
    username: String
    email: String
    password: String
    roles: [ID!]!
    emailSubscriptions: [SubscriptionInput]
  }

  type UpdateUserPayload {
    _id: ID!
    username: String
    email: String
    password: String
    emailSubscriptions: [Subscription]
  }
`

module.exports = updateUserTypeDefs
