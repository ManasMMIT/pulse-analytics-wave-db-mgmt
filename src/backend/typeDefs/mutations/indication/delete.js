const { gql } = require('apollo-server-express')

const deleteSourceIndicationTypeDefs = gql`
  input DeleteSourceIndicationInput {
    _id: ID!
  }

  type DeleteSourceIndicationPayload {
    _id: ID
    name: String
    regimens: [DeleteSourceRegimenPayload]
    therapeuticAreaId: String
  }
`

module.exports = deleteSourceIndicationTypeDefs
