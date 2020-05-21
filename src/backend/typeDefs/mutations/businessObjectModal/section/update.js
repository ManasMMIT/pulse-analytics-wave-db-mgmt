const { gql } = require('apollo-server-express')

const updateBusinessObjectModalSectionTypeDefs = gql`
  input UpdateBusinessObjectModalSectionInput {
    label: String!
    modalId: ID!
    tagId: ID!
    sectionId: ID!
  }
`

module.exports = updateBusinessObjectModalSectionTypeDefs
