const _ = require('lodash')
const mergeSitemapsAcrossRoles = require('../merge-roles-sitemaps')
const mockRoles = require('./mock-roles')
const rolesSitemapsMap = require('./mock-sitemaps-map')
const singleRoleExpectedResult = require('./single-role-expected-result')
const multipleRolesExpectedResult = require('./multiple-roles-expected-result')

test('inputs into mergeSitemapsAcrossRoles aren\'t mutated', () => {
  const originalMockRoles = _.merge([], mockRoles)
  const originalRolesSitemaps = _.merge({}, rolesSitemapsMap)

  mergeSitemapsAcrossRoles(mockRoles, rolesSitemapsMap)

  expect(mockRoles).toEqual(originalMockRoles)
  expect(rolesSitemapsMap).toEqual(originalRolesSitemaps)
})

test('user with one role isn\'t affected by merging logic', () => {
  expect(
    mergeSitemapsAcrossRoles(mockRoles.slice(0, 1), rolesSitemapsMap)
  ).toEqual(singleRoleExpectedResult)
})

test('user with two roles gets sitemaps merged properly', () => {
  expect(
    mergeSitemapsAcrossRoles(mockRoles, rolesSitemapsMap)
  ).toEqual(multipleRolesExpectedResult)
})
