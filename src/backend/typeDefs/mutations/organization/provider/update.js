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
    connections: JSON
    type: String
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
    connections: JSON
    type: String
  }
`

module.exports = updateProviderOrganizationTypeDefs
