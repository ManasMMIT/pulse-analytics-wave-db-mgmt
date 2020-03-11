const combineTeamsResources = require('../combineTeamsResources')

const masterListItemsById = require('./mocks/sample-master-list-by-id')

const {
  singleTeamInput,
  bothTeamsInput,

  bothTeamsOutput,
  singleTeamOutput,
} = require('./mocks/mock-teams')

describe('outputs single-node permissions', () => {
  test('for a user with a single team', () => {
    const result = combineTeamsResources({
      teams: singleTeamInput,
      masterListItemsById,
    })
  
    expect(result).toEqual(singleTeamOutput)
  })

  test('for a user with multiple teams', () => {
    const result = combineTeamsResources({
      teams: bothTeamsInput,
      masterListItemsById,
    })
  
    expect(result).toEqual(bothTeamsOutput)
  })

})
