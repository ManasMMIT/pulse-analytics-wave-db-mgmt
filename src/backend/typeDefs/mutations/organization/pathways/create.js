const { gql } = require('apollo-server-express')

const createPathwaysOrganizationTypeDefs = gql`
  input CreatePathwaysOrganizationInput {
    slug: String!
    organization: String
    organizationTiny: String
  }

  type CreatePathwaysOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = createPathwaysOrganizationTypeDefs
