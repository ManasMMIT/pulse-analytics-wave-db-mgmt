const { gql } = require('apollo-server-express')

const sendToTestGroup = gql`
  input SendToTestGroupInput {
    emailSubscriptions: [String!]!
    recipients: [String!]!
    usersToMock: [JSON]!
    date: String!
  }

  type SendToTestGroupPayload {
    message: String!
  }
`

module.exports = sendToTestGroup
