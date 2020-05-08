const { gql } = require('apollo-server-express')

const deletePopulationTypeDefs = gql`
  input DeletePopulationInput {
    _id: ID!
  }

  type DeletePopulationPayload {
    _id: ID
    name: String
  }
`

module.exports = deletePopulationTypeDefs
