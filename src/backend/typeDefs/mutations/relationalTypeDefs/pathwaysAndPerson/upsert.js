const { gql } = require('apollo-server-express')

const upsertPathwaysAndPersonConnectionTypeDefs = gql`
  input UpsertPathwaysAndPersonConnectionInput {
    _id: ID
    personId: String!
    pathwaysId: String!
    indicationIds: [String!]!
    pathwaysInfluencerTypes: [String!]!
    tumorTypeSpecialty: String
    internalFields: PathwaysAndPersonConnectionInternalFieldsInput!
    position: String
    priority: String
    alert: PathwaysAndPersonConnectionAlertInput!
    exclusionSettings: PathwaysAndPersonExclusionSettingsInput!
    startDate: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    endDate: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    startQuarter: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
    endQuarter: String # must be string to preserve ISO short, then convert accounting for timezone in resolver
  }

  input PathwaysAndPersonConnectionInternalFieldsInput {
    internalNotes: String
    pathwaysManagementTypes: [String!]!
    valueChairsIndications: [String!]!
    totalDisclosures: String
    dateDisclosure1: String
    dateDisclosure2: String
    dateDisclosure3: String
    dateDisclosure4: String
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
