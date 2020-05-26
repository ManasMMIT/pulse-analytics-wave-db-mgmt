const { gql } = require('apollo-server-express')

const createBusinessObjectModalTypeDefs = gql`
  input CreateBusinessObjectModalInput {
    label: String!
    boId: ID!
  }
`

module.exports = createBusinessObjectModalTypeDefs
