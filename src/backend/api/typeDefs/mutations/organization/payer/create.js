const { gql } = require('apollo-server-express')

const createPayerOrganizationTypeDefs = gql`
  input CreatePayerOrganizationInput {
    slug: String!
    organization: String
    organizationTiny: String
  }

  type CreatePayerOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = createPayerOrganizationTypeDefs
