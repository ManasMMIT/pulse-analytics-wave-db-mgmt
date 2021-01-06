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
    position: String
    priority: String
    alert: PathwaysAndPersonConnectionAlertInput! # this type is on the upsert typeDefs
    exclusionSettings: PathwaysAndPersonExclusionSettingsInput! # this type is on the upsert typeDefs
    startDate: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    endDate: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    startQuarter: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    endQuarter: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
  }
`

module.exports = deletePathwaysAndPersonConnectionTypeDefs
