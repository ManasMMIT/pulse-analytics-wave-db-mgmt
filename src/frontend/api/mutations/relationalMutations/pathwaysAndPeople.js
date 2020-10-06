import gql from 'graphql-tag'

export const UPSERT_PATHWAYS_AND_PERSON_CONNECTION = gql`
  mutation UpsertPathwaysAndPersonConnection(
    $input: UpsertPathwaysAndPersonConnectionInput!
  ) {
    upsertPathwaysAndPersonConnection(input: $input) {
      _id
      personId
      pathwaysId
      indicationIds
      pathwaysInfluencerTypes
      tumorTypeSpecialty
      internalFields {
        internalNotes
        pathwaysManagementTypes
        valueChairsIndicationIds
        totalDisclosures
        dateDisclosure1
        dateDisclosure2
        dateDisclosure3
        dateDisclosure4
      }
      position
      priority
      alert {
        date
        type
        description
      }
      exclusionSettings {
        isExcluded
        reason
      }
      startDate
      endDate
    }
  }
`
