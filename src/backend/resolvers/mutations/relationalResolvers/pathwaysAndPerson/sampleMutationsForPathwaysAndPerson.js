/*
! THIS FILE HAS SAMPLE MUTATIONS AND INPUTS FOR UPSERTION AND DELETION
! FOR TESTING THINGS OUT IN APOLLO DEVTOOLS.
! MAKES IT EASIER TO TEST ENDPOINTS WHILE THE SCHEMA IS UNSTABLE.
! WE CAN FEEL FREE TO DELETE IT AFTER THINGS STABILIZE.
*/

// ~~~~~~~~~~~~~~~ UPSERTION OP AND INPUT ~~~~~~~~~~~~~~~

mutation UpsertPathwaysAndPersonConnection($input: UpsertPathwaysAndPersonConnectionInput!) {
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

// for the variables section
{
  "input": {
    "_id": "5eac293b79e11113da3b67f2",
    "pathwaysId": "5d825338cc80b15a9476ba8a",
    "personId": "5f64cd4eafb0b526154a3a36",
    "indicationIds": ["5d6fa1f73b53cf87ec5076dc", "5d6fa1f73b53cf87ec5076dd"],
    "pathwaysInfluencerTypes": ["Steering Committee"],
    "tumorTypeSpecialty": "Breast",
    "internalFields": {
      "internalNotes": "Test internal note",
      "pathwaysManagementTypes": ["Clinical"],
      "valueChairsIndicationIds": ["5d6fa1f73b53cf87ec5076dc", "5d6fa1f73b53cf87ec5076dd"],
      "totalDisclosures": "test",
      "dateDisclosure1": "test1",
      "dateDisclosure2": "test2",
      "dateDisclosure3": "test3",
      "dateDisclosure4": "test4"
    },
    "position": "Non-Voting Member",
    "priority": "High",
    "alert": {
      "date": "2020-09-23T00:29:36.030Z",
      "type": "Influencer",
      "description": "Updated position from Breast Cancer Chair"
    },
    "exclusionSettings": {
      "isExcluded": true,
      "reason": "test reason"
    },
    "startDate": "2020-09-23T00:29:36.030Z",
    "endDate": "2020-09-23T00:29:36.030Z"
  }
}

// ~~~~~~~~~~~~~~~ DELETION OP AND INPUT ~~~~~~~~~~~~~~~

mutation DeletePathwaysAndPersonConnection($input: DeletePathwaysAndPersonConnectionInput!) {
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
// for the variables section (same as input above)
{
  "input": {
    "_id": "5eac293b79e11113da3b67f2",
    "pathwaysId": "5d825338cc80b15a9476ba8a",
    "personId": "5f64cd4eafb0b526154a3a36",
    "indicationIds": ["5d6fa1f73b53cf87ec5076dc", "5d6fa1f73b53cf87ec5076dd"],
    "pathwaysInfluencerTypes": ["Steering Committee"],
    "tumorTypeSpecialty": "Breast",
    "internalFields": {
      "internalNotes": "Test internal note",
      "pathwaysManagementTypes": ["Clinical"],
      "valueChairsIndicationIds": ["5d6fa1f73b53cf87ec5076dc", "5d6fa1f73b53cf87ec5076dd"],
      "totalDisclosures": "test",
      "dateDisclosure1": "test1",
      "dateDisclosure2": "test2",
      "dateDisclosure3": "test3",
      "dateDisclosure4": "test4"
    },
    "position": "Non-Voting Member",
    "priority": "High",
    "alert": {
      "date": "2020-09-23T00:29:36.030Z",
      "type": "Influencer",
      "description": "Updated position from Breast Cancer Chair"
    },
    "exclusionSettings": {
      "isExcluded": true,
      "reason": "test reason"
    },
    "startDate": "2020-09-23T00:29:36.030Z",
    "endDate": "2020-09-23T00:29:36.030Z"
  }
}
