const { gql } = require('apollo-server-express')

const transferPayerProjectPtpsTypeDefs = gql`
  input TransferPayerProjectPtpsInput {
    projectId: ID!
    orgTpIds: [ID!]!
  }
`

module.exports = transferPayerProjectPtpsTypeDefs
