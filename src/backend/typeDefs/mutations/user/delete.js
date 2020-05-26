const { gql } = require('apollo-server-express')

const deleteUserTypeDefs = gql`
  input DeleteUserInput {
    _id: ID!
  }

  type DeleteUserPayload {
    _id: ID!
    username: String
    email: String
    emailSubscriptions: [Subscription]
    defaultLanding: DefaultLanding
  }
`

module.exports = deleteUserTypeDefs
