const { gql } = require('apollo-server-express')

const updateTestEmailGroup = gql`
  input UpdateTestEmailGroupInput {
    _id: ID!
    name: String
    recipients: [String]
    usersToMock: [ID]
    emailSubscriptions: [ID]
  }
`

module.exports = updateTestEmailGroup
