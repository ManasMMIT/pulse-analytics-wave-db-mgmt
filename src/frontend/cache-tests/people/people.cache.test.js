import React from 'react'
import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render, act, waitFor } from '@testing-library/react'

import initialCache from './stubs/initialCache'
import initialPeople from './stubs/initialPeople'

import GetPeopleComponent from './components/GetPeopleComponent'
import CreatePersonComponent from './components/CreatePersonComponent'

import { GET_PEOPLE } from 'frontend/api/queries'
import { CREATE_PERSON } from 'frontend/api/mutations'

describe('Person Endpoints', () => {
  jest.setTimeout(6000)

  it('Initially READ data should populate the cache', async () => {
    const cache = new InMemoryCache()
    const queryMock = [
      {
        request: {
          query: GET_PEOPLE,
        },
        result: {
          data: {
            people: initialPeople,
          },
        },
      },
    ]

    const { getByTestId } = render(
      <MockedProvider cache={cache} mocks={queryMock}>
        <GetPeopleComponent />
      </MockedProvider>
    )

    await waitFor(() => getByTestId('list'))

    const updatedCache = cache.extract()

    const wasCachePopulatedCompletely = initialPeople.every(
      ({ _id }) => updatedCache[`Person:${_id}`]
    )
    expect(wasCachePopulatedCompletely).toBe(true)
  })

  // ? difference in result data and initial data
  it.todo('should update the cache correctly when query is already full')

  it.todo(
    'will a query that returns a subset replace cache with subset (e.g., getPeople with 1 person, when 100 are in caches)'
  )

  it.todo(
    'will a query that returns a superset update cache with additional data'
  )

  it('Create should update the cache correctly when triggered with refetch', async () => {
    const cache = new InMemoryCache().restore(initialCache)

    const _id = '4'
    const newPerson = { _id, firstName: 'Cache Integration', lastName: 'Test' }

    const postMutationPeople = [
      ...initialPeople,
      { ...newPerson, __typename: 'Person' },
    ]

    const mutationMocks = [
      {
        request: {
          query: CREATE_PERSON,
          variables: { input: newPerson },
        },
        result: {
          data: {
            createPerson: { ...newPerson, __typename: 'CreatePersonPayload' },
          },
        },
      },
      {
        request: {
          query: GET_PEOPLE,
        },
        result: {
          data: {
            people: postMutationPeople,
          },
        },
      },
    ]

    await act(async () => {
      await render(
        <MockedProvider cache={cache} mocks={mutationMocks}>
          <CreatePersonComponent person={newPerson} />
        </MockedProvider>
      )
    })

    const updatedCache = cache.extract()
    const doesNewPersonExistInCache = Boolean(updatedCache[`Person:${_id}`]._id)
    expect(doesNewPersonExistInCache).toBe(true)
  })
})
