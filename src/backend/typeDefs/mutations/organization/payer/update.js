const { gql } = require('apollo-server-express')

const updatePayerOrganizationTypeDefs = gql`
  input UpdatePayerOrganizationInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    connections: JSON
    type: String
  }

  type UpdatePayerOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    connections: JSON
    type: String
  }
`

module.exports = updatePayerOrganizationTypeDefs
