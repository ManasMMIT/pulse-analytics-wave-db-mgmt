const { gql } = require('apollo-server-express')

const createBusinessObjectFieldTypeDefs = gql`
  input CreateBusinessObjectFieldInput {
    businessObjectId: ID!
    field: BoFieldInput
  }

  input BoFieldInput {
    key: String!
    type: String!
  }
`

module.exports = createBusinessObjectFieldTypeDefs
