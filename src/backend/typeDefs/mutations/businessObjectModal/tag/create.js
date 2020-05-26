const { gql } = require('apollo-server-express')

const createBusinessObjectModalTagTypeDefs = gql`
  input CreateBusinessObjectModalTagInput {
    label: String!
    modalId: ID!
  }
`

module.exports = createBusinessObjectModalTagTypeDefs
