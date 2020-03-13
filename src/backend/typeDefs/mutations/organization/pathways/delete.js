const { gql } = require('apollo-server-express')

const deletePathwaysOrganizationTypeDefs = gql`
  input DeletePathwaysOrganizationInput {
    _id: String!
  }

  type DeletePathwaysOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = deletePathwaysOrganizationTypeDefs
