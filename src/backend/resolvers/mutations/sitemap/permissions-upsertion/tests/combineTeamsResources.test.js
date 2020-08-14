const combineTeamsResources = require('../combineTeamsResources')
const masterListItemsById = require('./mocks/sample-master-list-by-id')

const {
  input: singleTeamOnlyOneAccountInput,
  output: singleTeamOnlyOneAccountOutput,
} = require('./mocks/single-team-only-one-account')

const {
  input: singleTeamOnlyOneTreatmentPlanInput,
  output: singleTeamOnlyOneTreatmentPlanOutput,
} = require('./mocks/single-team-only-one-treatment-plan')

const {
  input: singleTeamAllSimpleResourcesInput,
  output: singleTeamAllSimpleResourcesOutput,
} = require('./mocks/single-team-all-simple-resources')

const {
  input: twoTeamsAllResourcesOneSideInput,
  output: twoTeamsAllResourcesOneSideOutput,
} = require('./mocks/two-teams-all-resources-on-one-side')

const {
  input: twoTeamsAllSimpleResourcesInput,
  output: twoTeamsAllSimpleResourcesOutput,
} = require('./mocks/two-teams-all-simple-resources')

describe("outputs a single-node's resources correctly", () => {
  test('for a single team with only one account', () => {
    const result = combineTeamsResources({
      teams: singleTeamOnlyOneAccountInput,
      masterListItemsById,
    })

    expect(result).toEqual(singleTeamOnlyOneAccountOutput)
  })

  test('for a single team with only one treatment plan', () => {
    const result = combineTeamsResources({
      teams: singleTeamOnlyOneTreatmentPlanInput,
      masterListItemsById,
    })

    expect(result).toEqual(singleTeamOnlyOneTreatmentPlanOutput)
  })

  test('for a single team with all resources', () => {
    const result = combineTeamsResources({
      teams: singleTeamAllSimpleResourcesInput,
      masterListItemsById,
    })

    expect(result).toEqual(singleTeamAllSimpleResourcesOutput)
  })

  test('for multiple teams with resources only on one side', () => {
    const result = combineTeamsResources({
      teams: twoTeamsAllResourcesOneSideInput,
      masterListItemsById,
    })

    expect(result).toEqual(twoTeamsAllResourcesOneSideOutput)
  })

  test('for multiple teams with all resources', () => {
    const result = combineTeamsResources({
      teams: twoTeamsAllSimpleResourcesInput,
      masterListItemsById,
    })

    expect(result).toEqual(twoTeamsAllSimpleResourcesOutput)
  })

  // ! Current weird behavior is if a user belongs to multiple teams and some have regional breakdown
  // ! and others don't, it's a roulette (based on array ordering) as to whether the user will get a breakdown.
  // ! This hasn't been a problem for us in the actual app because no user is currently in this situation --
  // ! for any user that has a breakdown, all of its teams happen to have breakdowns
  test('Expected but unwanted and soon-to-be-deprecated behavior: Regional breakdown for a user can be overwritten to blank', () => {
    const TEST_REGIONAL_BREAKDOWN = 'asdf'

    const result = combineTeamsResources({
      teams: [
        {
          resources: [
            {
              nodeId: '25fde1b5-4c24-4d8a-ad89-aa4afaca4c52',
              accounts: [],
              treatmentPlans: [],
              regionalBreakdown: TEST_REGIONAL_BREAKDOWN,
            },
          ],
        },
        {
          resources: [
            {
              nodeId: '25fde1b5-4c24-4d8a-ad89-aa4afaca4c52',
              accounts: [],
              treatmentPlans: [],
            },
          ],
        },
      ],
      masterListItemsById,
    })

    expect(result[0].regionalBreakdown).toEqual([])
  })
})
