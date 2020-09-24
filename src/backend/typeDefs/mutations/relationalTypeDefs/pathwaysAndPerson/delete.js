const { gql } = require('apollo-server-express')

const deletePathwaysAndPersonConnectionTypeDefs = gql`
  input DeletePathwaysAndPersonConnectionInput {
    _id: ID!
    personId: String!
    pathwaysId: String!
    indicationIds: [String!]!
    pathwaysInfluencerTypes: [String] # ?
    tumorTypeSpecialty: String # ? is this the same as therapeutic area or no?
    internalFields: PathwaysAndPersonConnectionInternalFieldsInput! # this type is on the upsert typeDefs
    # title: String # ? why 'title' instead of position like in JOIN_obms_people?
    position: String # ?
    priority: String
    alert: PathwaysAndPersonConnectionAlertInput! # this type is on the upsert typeDefs
    exclusionSettings: PathwaysAndPersonExclusionSettingsInput! # this type is on the upsert typeDefs
    startDate: DateTime
    endDate: DateTime
  }
`

module.exports = deletePathwaysAndPersonConnectionTypeDefs
