const { gql } = require('apollo-server-express')

const deleteBusinessObjectModalSectionTypeDefs = gql`
  input DeleteBusinessObjectModalSectionInput {
    modalId: ID!
    tagId: ID!
    sectionId: ID!
  }
`

module.exports = deleteBusinessObjectModalSectionTypeDefs
