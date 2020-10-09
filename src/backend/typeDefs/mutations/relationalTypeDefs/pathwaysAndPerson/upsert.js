const { gql } = require('apollo-server-express')

const upsertPathwaysAndPersonConnectionTypeDefs = gql`
  input UpsertPathwaysAndPersonConnectionInput {
    _id: ID
    personId: String!
    pathwaysId: String!
    indicationIds: [String!]!
    pathwaysInfluencerTypes: [String] # ?
    tumorTypeSpecialty: String # ? is this the same as therapeutic area or no?
    internalFields: PathwaysAndPersonConnectionInternalFieldsInput!
    # title: String # ? why 'title' instead of position like in JOIN_obms_people?
    position: String # ?
    priority: String
    alert: PathwaysAndPersonConnectionAlertInput!
    exclusionSettings: PathwaysAndPersonExclusionSettingsInput!
    startDate: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    endDate: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
  }

  input PathwaysAndPersonConnectionInternalFieldsInput {
    internalNotes: String
    pathwaysManagementTypes: [String!]!
    valueChairsIndicationIds: [String!]! # ? will this be IDs corresponding to real indications?
    totalDisclosures: String # ?
    dateDisclosure1: String # ?
    dateDisclosure2: String # ?
    dateDisclosure3: String # ?
    dateDisclosure4: String # ?
  }

  input PathwaysAndPersonConnectionAlertInput {
    date: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    type: String
    description: String
  }

  input PathwaysAndPersonExclusionSettingsInput {
    isExcluded: Boolean
    reason: String
  }
`

module.exports = upsertPathwaysAndPersonConnectionTypeDefs
