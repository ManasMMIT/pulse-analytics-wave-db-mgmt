const { gql } = require('apollo-server-express')

const updatePathwaysOrganizationTypeDefs = gql`
  input UpdatePathwaysOrganizationInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }

  type UpdatePathwaysOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = updatePathwaysOrganizationTypeDefs
