const { gql } = require('apollo-server-express')

const createIndicationTypeDefs = gql`
  input CreateIndicationInput {
    _id: ID # included but should always be null
    name: String!
    regimens: [CreateRegimenInput]
    therapeuticAreaId: String!
  }

  type CreateIndicationPayload {
    _id: ID
    name: String
    regimens: [CreateRegimenPayload]
    therapeuticAreaId: String
  }
`

module.exports = createIndicationTypeDefs
