const { gql } = require('apollo-server-express')

const emailAlertsTypeDefs = gql`
  input UpdateEmailAlertInput {
    templateType: String!
    emailList: [String!]!
  }

  type UpdateEmailAlertPayload {
    message: String
    failedEmails: [String]
  }
`

module.exports = emailAlertsTypeDefs
