const { gql } = require('apollo-server-express')

const removePayerProjectPtpsTypeDefs = gql`
  input RemovePayerProjectPtpsInput {
    orgTpIds: [ID!]!
  }
`

module.exports = removePayerProjectPtpsTypeDefs
