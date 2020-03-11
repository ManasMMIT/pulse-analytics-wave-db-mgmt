const { gql } = require('apollo-server-express')

const deleteApmOrganizationTypeDefs = gql`
  input DeleteApmOrganizationInput {
    _id: String!
  }

  type DeleteApmOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = deleteApmOrganizationTypeDefs
