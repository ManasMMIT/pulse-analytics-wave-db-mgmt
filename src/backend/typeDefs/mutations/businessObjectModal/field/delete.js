const { gql } = require('apollo-server-express')

const deleteBusinessObjectModalFieldTypeDefs = gql`
  input DeleteBusinessObjectModalFieldInput {
    modalId: ID!
    tagId: ID!
    sectionId: ID!
    fieldId: ID!
  }
`

module.exports = deleteBusinessObjectModalFieldTypeDefs
