const { gql } = require('apollo-server-express')

const updateBusinessObjectModalFieldTypeDefs = gql`
  input UpdateBusinessObjectModalFieldInput {
    label: String!
    modalId: ID!
    tagId: ID!
    sectionId: ID!
    fieldId: ID!
    inputProps: String! # object is passed JSON.stringify from frontend
    inputComponent: String!
  }
`

module.exports = updateBusinessObjectModalFieldTypeDefs
