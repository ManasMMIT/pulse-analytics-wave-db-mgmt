const { gql } = require('apollo-server-express')

const deleteProviderOrganizationTypeDefs = gql`
  input DeleteProviderOrganizationInput {
    _id: String!
  }

  type DeleteProviderOrganizationPayload {
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

module.exports = deleteProviderOrganizationTypeDefs
