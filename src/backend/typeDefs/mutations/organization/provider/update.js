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
  }
`

module.exports = updateProviderOrganizationTypeDefs
