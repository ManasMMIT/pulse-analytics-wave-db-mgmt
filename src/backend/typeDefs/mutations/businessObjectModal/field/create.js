const { gql } = require('apollo-server-express')

const createBusinessObjectModalFieldTypeDefs = gql`
  input CreateBusinessObjectModalFieldInput {
    label: String!
    modalId: ID!
    tagId: ID!
    sectionId: ID!
    boFieldId: ID!
    inputProps: String! # object is passed JSON.stringify from frontend
    inputComponent: String!
  }
`

module.exports = createBusinessObjectModalFieldTypeDefs
