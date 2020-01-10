const { gql } = require('apollo-server-express')

const updateProviderOrganizationTypeDefs = gql`
  input UpdateProviderOrganizationInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
    state: String
    city: String
    oncologistsCount: Int
    sitesCount: Int
  }

  type UpdateProviderOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
    state: String
    city: String
    oncologistsCount: Int
    sitesCount: Int
  }
`

module.exports = updateProviderOrganizationTypeDefs
