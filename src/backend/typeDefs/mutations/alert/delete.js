const { gql } = require('apollo-server-express')

const deleteEmailUsersTypeDefs = gql`
  input DeleteEmailUsersInput {
    users: [DeleteEmailUserInput]
  }

  input DeleteEmailUserInput {
    username: String!
    email: String
    isPulseTest: Boolean
    isTdgTest: Boolean
  }

  type DeleteEmailUsersPayload {
    errors: [String]
  }
`

module.exports = deleteEmailUsersTypeDefs