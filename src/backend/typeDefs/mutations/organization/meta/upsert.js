const { gql } = require('apollo-server-express')

const upsertOrganizationMetaTypeDefs = gql`
  input UpsertOrganizationMetaInput {
    action: String!
    _ids: [ID!]!
  }

  type UpsertOrganizationMetaPayload {
    _id: ID!
    accountId: ID
    exportedAt: Date
    exporter: JSON
    updatedAt: Date
    updater: JSON
  }
`

module.exports = upsertOrganizationMetaTypeDefs
