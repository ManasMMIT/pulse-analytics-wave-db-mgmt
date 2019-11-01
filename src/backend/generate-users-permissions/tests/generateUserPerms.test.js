const generateUserPerms = require('../generateUserPerms')
const {
  input: singleTeamSingleNodeInput,
  output: singleTeamSingleNodeOutput,
} = require('./mocks/single-team-single-node-resources')

const {
  input: nonConflictingInput,
  output: nonConflictingOutput,
} = require('./mocks/non-conflicting')

const {
  input: conflictingInput,
  output: conflictingOutput,
} = require('./mocks/conflicting')

const masterListItemsById = require('./mocks/master-list-items-by-id')

test('outputs single-node permissions for user', () => {
  const result = generateUserPerms({
    userId: 'auth0|5db864fb3f0d010e29343e62',
    teamResourcesByNodeId: singleTeamSingleNodeInput,
    masterListItemsById,
  })

  expect(result).toEqual(singleTeamSingleNodeOutput)
})

test('merges non-conflicting, single-node permissions for multi-team user', () => {
  const result = generateUserPerms({
    userId: 'auth0|5db864fb3f0d010e29343e62',
    teamResourcesByNodeId: nonConflictingInput,
    masterListItemsById,
  })

  expect(result).toEqual(nonConflictingOutput)
})

test('merges permissions for multi-team user with duplicates', () => {
  const result = generateUserPerms({
    userId: 'auth0|5db864fb3f0d010e29343e62',
    teamResourcesByNodeId: conflictingInput,
    masterListItemsById,
  })

  expect(result).toEqual(conflictingOutput)
})
