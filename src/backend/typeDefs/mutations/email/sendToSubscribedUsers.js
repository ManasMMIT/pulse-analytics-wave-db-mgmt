const { gql } = require('apollo-server-express')

const sendToSubscribedUsersTypeDefs = gql`
  input SendToSubscribedUsersInput {
    _id: String!
    date: String!
  }

  type SendToSubscribedUsersPayload {
    message: String!
    failedEmails: [String]
  }
`

module.exports = sendToSubscribedUsersTypeDefs
