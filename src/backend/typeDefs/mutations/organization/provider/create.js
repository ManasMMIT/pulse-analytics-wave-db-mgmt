const { gql } = require('apollo-server-express')

const createProviderOrganizationTypeDefs = gql`
  input CreateProviderOrganizationInput {
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
  }

  type CreateProviderOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
  }
`

module.exports = createProviderOrganizationTypeDefs
