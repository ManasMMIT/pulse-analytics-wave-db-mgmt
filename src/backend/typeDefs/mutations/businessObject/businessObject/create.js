const { gql } = require('apollo-server-express')

const createBusinessObjectTypeDefs = gql`
  input CreateBusinessObjectInput {
    name: String!
    sourceCollection: String
  }
`

module.exports = createBusinessObjectTypeDefs
