import React from 'react'
import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'

import initialCache from './mocks/initialCache'
import initialPeople from './mocks/initialPeople'

import GetPeopleComponent from './components/GetPeopleComponent'
import CreatePersonComponent from './components/CreatePersonComponent'

import { GET_PEOPLE } from 'frontend/api/queries'
import { CREATE_PERSON } from 'frontend/api/mutations'

// TODO: Add Update and Delete tests
describe('People Cache MGMT', () => {
  jest.setTimeout(6000)

  describe('GET_PEOPLE', () => {
    it('Initially fetched data should populate the cache', async () => {
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

    it('Fetched data should replace pre-existing cached data', async () => {
      const cache = new InMemoryCache().restore(initialCache)

      const newPerson = {
        _id: '4',
        firstName: 'Cache Integration',
        lastName: 'Test',
        __typename: 'Person',
      }

      const queryMock = [
        {
          request: {
            query: GET_PEOPLE,
          },
          result: {
            data: {
              people: [...initialPeople, newPerson],
            },
          },
        },
      ]

      // Only known way to replace the cache, without frontend merging logic/resolvers is to use `fetchPolicy: 'network-only'`.
      const optionsObject = { fetchPolicy: 'network-only' }

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={queryMock}>
          <GetPeopleComponent optionsObject={optionsObject} />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('list'))

      const updatedCache = cache.extract()

      const wasCacheRePopulated = Boolean(updatedCache[`Person:4`]._id)
      expect(wasCacheRePopulated).toBe(true)
    })

    it.todo(
      'will a query that returns a subset replace cache with subset (e.g., getPeople with 1 person, when 100 are in caches)'
    )

    it.todo(
      'will a query that returns a superset update cache with additional data'
    )
  })

  describe('CREATE_PERSON', () => {
    it('should update the cache correctly after refetch', async () => {
      const cache = new InMemoryCache().restore(initialCache)

      const _id = '4'
      const newPerson = {
        _id,
        firstName: 'Cache Integration',
        lastName: 'Test',
      }

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

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={mutationMocks}>
          <CreatePersonComponent person={newPerson} />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('result'))

      const updatedCache = cache.extract()
      const doesNewPersonExistInCache = Boolean(
        updatedCache[`Person:${_id}`]._id
      )
      expect(doesNewPersonExistInCache).toBe(true)
    })
  })
})
