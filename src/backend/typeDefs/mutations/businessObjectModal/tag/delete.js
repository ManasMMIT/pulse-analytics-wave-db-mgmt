const { gql } = require('apollo-server-express')

const deleteBusinessObjectModalTagTypeDefs = gql`
  input DeleteBusinessObjectModalTagInput {
    modalId: ID!
    tagId: ID!
  }
`

module.exports = deleteBusinessObjectModalTagTypeDefs
