const { gql } = require('apollo-server-express')

const createBusinessObjectModalSectionTypeDefs = gql`
  input CreateBusinessObjectModalSectionInput {
    label: String!
    modalId: ID!
    tagId: ID!
  }
`

module.exports = createBusinessObjectModalSectionTypeDefs
