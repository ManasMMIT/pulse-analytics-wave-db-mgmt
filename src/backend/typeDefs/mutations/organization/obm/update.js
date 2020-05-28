const { gql } = require('apollo-server-express')

const updateObmOrganizationTypeDefs = gql`
  input UpdateObmOrganizationInput {
    _id: ID!
    slug: String!
    organization: String
    organizationTiny: String
    businessModel: String
    start: Int
  }

  type UpdateObmOrganizationPayload {
    _id: ID!
    slug: String!
    organization: String
    organizationTiny: String
    businessModel: String
    start: Int
  }
`

module.exports = updateObmOrganizationTypeDefs
