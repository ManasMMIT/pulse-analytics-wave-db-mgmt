const { gql } = require('apollo-server-express')

const updateSourceIndicationTypeDefs = gql`
  input UpdateSourceIndicationInput {
    _id: String!
    name: String!
    regimens: [UpdateSourceRegimenInput]
  }

  type UpdateSourceIndicationPayload {
    _id: ID
    name: String
    regimens: [UpdateSourceRegimenPayload]
  }
`

module.exports = updateSourceIndicationTypeDefs
