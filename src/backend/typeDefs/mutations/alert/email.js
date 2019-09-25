const { gql } = require('apollo-server-express')

const emailAlertsTypeDefs = gql`
  input EmailAlertInput {
    templateType: String!
    emailList: [String!]!
  }

  type EmailAlertPayload {
    message: String
    failedEmails: [String]
  }
`

module.exports = emailAlertsTypeDefs
