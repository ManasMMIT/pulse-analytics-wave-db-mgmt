const { gql } = require('apollo-server-express')

const deleteBusinessObjectModalTypeDefs = gql`
  input DeleteBusinessObjectModalInput {
    modalId: ID!
  }
`

module.exports = deleteBusinessObjectModalTypeDefs
