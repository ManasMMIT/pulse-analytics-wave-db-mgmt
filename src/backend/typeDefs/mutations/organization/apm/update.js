const { gql } = require('apollo-server-express')

const updateApmOrganizationTypeDefs = gql`
  input UpdateApmOrganizationInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }

  type UpdateApmOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = updateApmOrganizationTypeDefs
