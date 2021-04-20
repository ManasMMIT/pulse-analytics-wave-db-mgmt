import getNewSearchParams from '../getNewSearchParams'

test('Set first empty search params', () => {
  const searchParamsAncestry = ['id']
  const searchParam = 'id'
  const currentSearchParams = {}
  const newSearchInput = '1'

  const firstEmptyOutput = {
    id: '1'
  }

  const newSearchParams = getNewSearchParams(searchParamsAncestry, searchParam, currentSearchParams, newSearchInput)
  expect(newSearchParams).toStrictEqual(firstEmptyOutput)
})

test('Set second empty search param', () => {
  const searchParamsAncestry = ['id1', 'id2']
  const searchParam = 'id2'
  const currentSearchParams = {
    id1: '1'
  }
  const newSearchInput = '2'

  const secondEmptyOutput = {
    id1: '1',
    id2: '2',
  }

  const newSearchParams = getNewSearchParams(searchParamsAncestry, searchParam, currentSearchParams, newSearchInput)
  expect(newSearchParams).toStrictEqual(secondEmptyOutput)
})

test('Reset first search param (singular param)', () => {
  const searchParamsAncestry = ['id1']
  const searchParam = 'id1'
  const currentSearchParams = {
    id1: '1'
  }
  const newSearchInput = '2'

  const resetFirstOutput = {
    id1: '2',
  }

  const newSearchParams = getNewSearchParams(searchParamsAncestry, searchParam, currentSearchParams, newSearchInput)
  expect(newSearchParams).toStrictEqual(resetFirstOutput)
})

test('Reset second search param', () => {
  const searchParamsAncestry = ['id1', 'id2']
  const searchParam = 'id2'
  const currentSearchParams = {
    id1: '1',
    id2: '2',
  }
  const newSearchInput = '3'

  const resetSecondOutput = {
    id1: '1',
    id2: '3',
  }

  const newSearchParams = getNewSearchParams(searchParamsAncestry, searchParam, currentSearchParams, newSearchInput)
  expect(newSearchParams).toStrictEqual(resetSecondOutput)
})

test('Reset first search param (multiple params)', () => {
  const searchParamsAncestry = ['id1']
  const searchParam = 'id1'
  const currentSearchParams = {
    id1: '1',
    id2: '2',
  }
  const newSearchInput = '2'

  const resetFirstOutput = {
    id1: '2',
  }

  const newSearchParams = getNewSearchParams(searchParamsAncestry, searchParam, currentSearchParams, newSearchInput)
  expect(newSearchParams).toStrictEqual(resetFirstOutput)
})
