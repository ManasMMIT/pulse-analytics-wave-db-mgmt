const { gql } = require('apollo-server-express')

const createPopulationTypeDefs = gql`
  input CreatePopulationInput {
    _id: ID # included but should always be null
    name: String!
  }

  type CreatePopulationPayload {
    _id: ID
    name: String
  }
`

module.exports = createPopulationTypeDefs
