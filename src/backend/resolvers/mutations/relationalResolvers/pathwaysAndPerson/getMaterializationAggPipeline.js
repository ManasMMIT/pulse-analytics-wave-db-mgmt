/*
! THIS FILE IS MEANT TO BE WHERE THE MATERIALIZATION AGG PIPELINE GOES.
! NOTE BELOW IS LEFT FOR REFERENCE ABOUT WHAT FIELDS CORRESPOND TO WHAT.

REF LINKS:
- https://dedhamgroup.atlassian.net/wiki/spaces/POL/pages/1479999511/Pathway+Influencers+Bulk+Import
- https://pulse-digital.invisionapp.com/console/Pathway-Influencers-ckdq0qtix0dml016kbjm955vl/ckdyt29dj00xt01zqvq7o2258/play?frame-cb=1600886656507
*/

// ! there must be match stage prior to this one
// ! that excludes anything with exclusionSettings.excluded set to true

const TEMP_projectStage = {
  /*
    personId join op will generate the following:
      - member
      - npi number
      - affiliation
      - affiliationPosition
      - primaryState

    pathwaysId join op will generate the following:
      - slug
      - organizationType
      - organization

  */
  _id: 1,
  influencerType: '$pathwaysInfluencerTypes', // ! convert 'pathwaysInfluencerTypes' array to joined string
  title: '$position',
  indication: '$indicationIds', // ! transform into hydrated array of strings
  indicationCategory: '$tumorTypeSpeciality', // ! still unclear if this key will change to therapeuticAreaId
  priority: 1,
  startDate: '$startDate', // ! unf must be formatted to old '1/15/2019' date format
  outdated: '$endDate', // ! guessing at this mapping; should be a date type
  alertDate: '$alertDate.date',
  alertType: '$alertDate.type',
  alertDescription: '$alertDate.description',
  materializedOn: '$$DATE', // ! new field for our reference
}

module.exports = () => []
