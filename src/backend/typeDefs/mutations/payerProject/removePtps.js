const { gql } = require('apollo-server-express')

const removePayerProjectPtpsTypeDefs = gql`
  input RemovePayerProjectPtpsInput {
    projectId: ID!
    orgTpIds: [ID!]!
  }
`

module.exports = removePayerProjectPtpsTypeDefs
