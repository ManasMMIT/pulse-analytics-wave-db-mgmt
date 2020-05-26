const { gql } = require('apollo-server-express')

const deleteBusinessObjectModalFieldTypeDefs = gql`
  input DeleteBusinessObjectModalFieldInput {
    _id: ID!
    modalId: ID!
    tagId: ID!
    sectionId: ID!
  }
`

module.exports = deleteBusinessObjectModalFieldTypeDefs
