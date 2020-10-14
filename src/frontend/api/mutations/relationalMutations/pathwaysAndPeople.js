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
        valueChairsIndications
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
      startQuarter
      endQuarter
    }
  }
`

export const DELETE_PATHWAYS_AND_PERSON_CONNECTION = gql`
  mutation DeletePathwaysAndPersonConnection(
    $input: DeletePathwaysAndPersonConnectionInput!
  ) {
    deletePathwaysAndPersonConnection(input: $input) {
      _id
      personId
      pathwaysId
      indicationIds
      pathwaysInfluencerTypes
      tumorTypeSpecialty
      internalFields {
        internalNotes
        pathwaysManagementTypes
        valueChairsIndications
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
      startQuarter
      endQuarter
    }
  }
`
