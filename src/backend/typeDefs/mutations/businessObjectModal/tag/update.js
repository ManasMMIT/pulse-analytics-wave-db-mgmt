const { gql } = require('apollo-server-express')

const updateBusinessObjectModalTagTypeDefs = gql`
  input UpdateBusinessObjectModalTagInput {
    label: String!
    modalId: ID!
    tagId: ID!
  }
`

module.exports = updateBusinessObjectModalTagTypeDefs
