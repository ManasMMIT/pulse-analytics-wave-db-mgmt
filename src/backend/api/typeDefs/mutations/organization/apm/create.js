const { gql } = require('apollo-server-express')

const createApmOrganizationTypeDefs = gql`
  input CreateApmOrganizationInput {
    slug: String!
    organization: String
    organizationTiny: String
  }

  type CreateApmOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = createApmOrganizationTypeDefs
