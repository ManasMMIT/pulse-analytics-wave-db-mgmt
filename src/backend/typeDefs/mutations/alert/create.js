const { gql } = require('apollo-server-express')

const createEmailUsersTypeDefs = gql`
  input CreateEmailUsersInput {
    users: [CreateEmailUserInput]
  }

  input CreateEmailUserInput {
    username: String!
    email: String
    isPulseTest: Boolean
    isTdgTest: Boolean
  }

  type CreateEmailUsersPayload {
    errors: [String]
  }
`

module.exports = createEmailUsersTypeDefs