const { gql } = require('apollo-server-express')

const updateTherapeuticAreaTypeDefs = gql`
  input UpdateTherapeuticAreaInput {
    _id: String!
    name: String!
  }

  type UpdateTherapeuticAreaPayload {
    _id: ID!
    name: String
  }
`

module.exports = updateTherapeuticAreaTypeDefs
