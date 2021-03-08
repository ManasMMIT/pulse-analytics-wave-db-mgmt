// ! UNSTABLE: typeDefs shared by multiple views/inputs/schemas

const { gql } = require('apollo-server-express')

const updateSourceIndicationTypeDefs = gql`
  input UpdateSourceIndicationInput {
    _id: ID!
    name: String!
    uuid: String
    # can't do [UpdateSourceRegimenInput!]! because the regular indications panel
    # doesn't pass regimens and has no bearing on that slice
    regimens: [UpdateSourceRegimenInput!]
    # can't do therapeuticAreaId: String! because the phoenix treatment plans
    # page doesn't pass therapeuticAreaId and has no bearing on that slice
    therapeuticAreaId: String
  }

  type UpdateSourceIndicationPayload {
    _id: ID
    name: String
    uuid: String
    regimens: [UpdateSourceRegimenPayload]
    therapeuticAreaId: String
  }
`

module.exports = updateSourceIndicationTypeDefs
