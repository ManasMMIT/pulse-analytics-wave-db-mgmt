const { gql } = require('apollo-server-express')

const updateSourceIndicationTypeDefs = gql`
  input UpdateSourceIndicationInput {
    _id: String!
    name: String!
  }

  type UpdateSourceIndicationPayload {
    _id: ID
    name: String
  }
`

module.exports = updateSourceIndicationTypeDefs
