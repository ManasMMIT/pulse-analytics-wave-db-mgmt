const { gql } = require('apollo-server-express')

const createTherapeuticAreaTypeDefs = gql`
  input CreateTherapeuticAreaInput {
    name: String!
  }

  type CreateTherapeuticAreaPayload {
    _id: ID!
    name: String
  }
`

module.exports = createTherapeuticAreaTypeDefs
