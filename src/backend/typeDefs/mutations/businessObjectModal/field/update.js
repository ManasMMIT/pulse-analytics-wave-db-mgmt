const { gql } = require('apollo-server-express')

const updateBusinessObjectModalFieldTypeDefs = gql`
  input UpdateBusinessObjectModalFieldInput {
    _id: ID!
    label: String!
    modalId: ID!
    tagId: ID!
    sectionId: ID!
    inputProps: String! # object is passed JSON.stringify from frontend
    inputComponent: String!
    boFieldId: ID # form is shared between update and create, so boFieldId is stubbed to stop breakage
  }
`

module.exports = updateBusinessObjectModalFieldTypeDefs
