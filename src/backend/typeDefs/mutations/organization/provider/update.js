const { gql } = require('apollo-server-express')

const updateProviderOrganizationTypeDefs = gql`
  input UpdateProviderOrganizationInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
  }

  type UpdateProviderOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
  }
`

module.exports = updateProviderOrganizationTypeDefs
