const { gql } = require('apollo-server-express')

const createBusinessObjectFieldTypeDefs = gql`
  input CreateBusinessObjectFieldInput {
    businessObjectId: ID!
    field: BoFieldInput!
  }

  input BoFieldInput {
    _id: ID
    key: String!
    type: String!
  }
`

module.exports = createBusinessObjectFieldTypeDefs
