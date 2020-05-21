const { gql } = require('apollo-server-express')

const updateBusinessObjectModalTypeDefs = gql`
  input UpdateBusinessObjectModalInput {
    label: String!
    modalId: ID!
    boId: ID # not used by resolver, but added here b/c frontend reuses form inputs for create and update
  }
`

module.exports = updateBusinessObjectModalTypeDefs
