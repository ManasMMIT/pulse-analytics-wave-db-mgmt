const { gql } = require('apollo-server-express')

const deletePayerOrganizationTypeDefs = gql`
  input DeletePayerOrganizationInput {
    _id: String!
  }

  type DeletePayerOrganizationPayload {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
  }
`

module.exports = deletePayerOrganizationTypeDefs
