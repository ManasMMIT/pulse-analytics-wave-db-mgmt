const { gql } = require('apollo-server-express')

const deleteTherapeuticAreaTypeDefs = gql`
  input DeleteTherapeuticAreaInput {
    _id: ID!
  }

  type DeleteTherapeuticAreaPayload {
    _id: ID!
    name: String
  }
`

module.exports = deleteTherapeuticAreaTypeDefs
