const { gql } = require('apollo-server-express')

const upsertPathwaysAndPersonConnectionTypeDefs = gql`
  # some of these fields might be labeled as "required" on the FE form but
  # because there's an exclusion escape clause, they're ALLOWED to be empty arrays
  # or null -- that's a "draft state"
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
