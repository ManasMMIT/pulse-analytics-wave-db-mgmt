const getCombinedResources = require('./../getCombinedResources')
const resources = require('./mocks/resources')

const resourcesToCombine = [resources.A, resources.B]

const {
  indications,
  accounts,
  regionalBreakdown,
} = getCombinedResources(resourcesToCombine)

test('picks only the first regionalBreakdown', () => {
  expect(regionalBreakdown).toStrictEqual(resources.A.regionalBreakdown)
})

test('combines, uniques, and sorts object permissions', () => {
  const expectedIndications = [
    { _id: '1b', name: 'blue eyes white dragon' },
    { _id: '2b', name: 'dark magician' },
    { _id: '5b', name: 'EXODIA!!' },
    { _id: '4b', name: 'Soon to be activated trap card' },
    { _id: '3b', name: 'Yugi\'s hair' }
  ]

  const expectedAccounts = [
    { _id: '3a', name: 'bandai' },
    { _id: '2b', name: 'hummus pita co' },
    { _id: '1b', name: 'just salad' },
    { _id: '1a', name: 'merck' },
    { _id: '2a', name: 'pegasus inc' },
  ]

  expect(indications).toStrictEqual(expectedIndications)
  expect(accounts).toStrictEqual(expectedAccounts)
})
