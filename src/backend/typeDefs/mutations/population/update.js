const { gql } = require('apollo-server-express')

const updatePopulationTypeDefs = gql`
  input UpdatePopulationInput {
    _id: String!
    name: String!
  }

  type UpdatePopulationPayload {
    _id: ID
    name: String
  }
`

module.exports = updatePopulationTypeDefs
