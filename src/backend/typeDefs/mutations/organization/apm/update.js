const { gql } = require('apollo-server-express')

const updateApmOrganizationTypeDefs = gql`
  input UpdateApmOrganizationInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    connections: JSON
    type: String
  }

  type UpdateApmOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    connections: JSON
    type: String
  }
`

module.exports = updateApmOrganizationTypeDefs
