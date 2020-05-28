const { gql } = require('apollo-server-express')

const createObmOrganizationTypeDefs = gql`
  input CreateObmOrganizationInput {
    slug: String!
    organization: String
    organizationTiny: String
    businessModel: String
    start: Int
  }

  type CreateObmOrganizationPayload {
    _id: ID!
    slug: String!
    organization: String
    organizationTiny: String
    businessModel: String
    start: Int
  }
`

module.exports = createObmOrganizationTypeDefs
