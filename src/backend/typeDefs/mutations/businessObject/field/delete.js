const { gql } = require('apollo-server-express')

const deleteBusinessObjectFieldTypeDefs = gql`
  input DeleteBusinessObjectFieldInput {
    businessObjectId: ID!
    fieldId: ID!
  }
`

module.exports = deleteBusinessObjectFieldTypeDefs
