const { gql } = require('apollo-server-express')

const createProviderOrganizationTypeDefs = gql`
  input CreateProviderOrganizationInput {
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
    state: String
    city: String
    oncologistsCount: Int
    sitesCount: Int
  }

  type CreateProviderOrganizationPayload {
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

module.exports = createProviderOrganizationTypeDefs
