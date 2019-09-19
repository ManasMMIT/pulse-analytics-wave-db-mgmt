const { gql } = require('apollo-server-express')

const updateAccountTypeDefs = gql`
  input UpdateAccountInput {
    _id: String!
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
  }

  type UpdateAccountPayload {
    _id: String!
    type: String
    slug: String!
    organization: String
    organizationTiny: String
    providerCancerCenter: String
  }
`

module.exports = updateAccountTypeDefs
