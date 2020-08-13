import React from 'react'
import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'
import _ from 'lodash'

import initialCache from './mocks/initialCache'
import initialPeople from './mocks/initialPeople'

import GetPeopleComponent from './components/GetPeopleComponent'
import MutatePersonComponent from './components/MutatePersonComponent'

import { GET_PEOPLE } from 'frontend/api/queries'
import {
  CREATE_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
} from 'frontend/api/mutations'

describe('People Cache MGMT', () => {
  jest.setTimeout(6000)

  describe('GET_PEOPLE', () => {
    it('Populates blank cache with initially fetched data', async () => {
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

      const { getByTestId, getByText } = render(
        <MockedProvider cache={cache} mocks={queryMock}>
          <GetPeopleComponent />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('list'))
      // ! If test breaks: very brittle string check here. Did the mock component render change?
      const initialPersonDataInRender = getByText(
        initialPeople[0].firstName + ' ' + initialPeople[0].lastName
      )

      const updatedCache = cache.extract()

      const wasNormalizedCachePopulated = initialPeople.every(
        ({ _id }) => updatedCache[`Person:${_id}`]
      )

      const wasRootQueryCachePopulated =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length

      expect(Boolean(initialPersonDataInRender)).toBe(true)
      expect(wasRootQueryCachePopulated).toBe(true)
      expect(wasNormalizedCachePopulated).toBe(true)
    })

    // ! UNEXPECTED RESULT: 'data' returned by useQuery is undefined even though the data is in the cache.
    // ! This isn't the case in the application as far as we know. But the behavior is captured by this test
    // ! in the expect(testNode.innerHTML).toEqual('no data') statement.
    it(`Doesn't fetch anything new if query result is in cache (STUBBED: fetchPolicy: 'cache-only')`, async () => {
      // !! Warning is thrown about possible data loss
      const cache = new InMemoryCache().restore(initialCache)

      const newPerson = {
        _id: '1337',
        firstName: 'Joseph',
        lastName: 'Joestar',
        __typename: 'Person',
      }

      const queryMock = [
        {
          request: {
            query: GET_PEOPLE,
          },
          result: {
            data: {
              people: [newPerson],
            },
          },
        },
      ]

      const optionsObject = { fetchPolicy: 'cache-only' }

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={queryMock}>
          <GetPeopleComponent optionsObject={optionsObject} />
        </MockedProvider>
      )

      let testNode
      await waitFor(() => (testNode = getByTestId('list')))

      const updatedCache = cache.extract() // "updatedCache" but nothing should've changed

      const areAllInitialPeopleInTheCache = initialPeople.every(
        ({ _id }) => updatedCache[`Person:${_id}`]
      )

      const areNumPeopleInCacheTheSame =
        initialPeople.length ===
        Object.keys(updatedCache).filter((el) => el.includes('Person:')).length

      const hasNormalizedCacheStayedTheSame =
        areAllInitialPeopleInTheCache && areNumPeopleInCacheTheSame

      const hasRootQueryCacheStayedTheSame =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length

      expect(hasRootQueryCacheStayedTheSame).toBe(true)
      expect(hasNormalizedCacheStayedTheSame).toBe(true)
      expect(testNode.innerHTML).toEqual('no data')
    })

    it(`Appends what's new to both ROOT_QUERY and normalized caches when a superset of a non-empty cache is fetched network-only`, async () => {
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

      const optionsObject = { fetchPolicy: 'network-only' }

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={queryMock}>
          <GetPeopleComponent optionsObject={optionsObject} />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('list'))

      const updatedCache = cache.extract()

      const doesRootQueryHaveAllPeople =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length + 1

      const doesNormalizedCacheHaveAllPeople = [
        ...initialPeople,
        newPerson,
      ].every(({ _id }) => updatedCache[`Person:${_id}`])

      expect(doesRootQueryHaveAllPeople).toBe(true)
      expect(doesNormalizedCacheHaveAllPeople).toBe(true)
    })

    it(`Replaces the ROOT_QUERY cache and leaves the normalized cache alone when there's a non-empty cache and disjoint data is fetched network-only`, async () => {
      // !! Warning is thrown about possible data loss
      const cache = new InMemoryCache().restore(initialCache)

      const newPerson = {
        _id: '1337',
        firstName: 'Joseph',
        lastName: 'Joestar',
        __typename: 'Person',
      }

      const queryMock = [
        {
          request: {
            query: GET_PEOPLE,
          },
          result: {
            data: {
              people: [newPerson],
            },
          },
        },
      ]

      const optionsObject = { fetchPolicy: 'network-only' }

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={queryMock}>
          <GetPeopleComponent optionsObject={optionsObject} />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('list'))

      const updatedCache = cache.extract()

      const doesNormalizedCacheHaveAllPeople = [
        ...initialPeople,
        newPerson,
      ].every(({ _id }) => updatedCache[`Person:${_id}`])

      const doesRootQueryCacheOnlyHaveNewPerson =
        updatedCache.ROOT_QUERY.people.length === 1 &&
        updatedCache.ROOT_QUERY.people[0].__ref === `Person:${newPerson._id}`

      expect(doesRootQueryCacheOnlyHaveNewPerson).toBe(true)
      expect(doesNormalizedCacheHaveAllPeople).toBe(true)
    })
  })

  describe('CREATE_PERSON', () => {
    it('Adds a new person to the cache', async () => {
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
          <MutatePersonComponent
            refetchQueries={[{ query: GET_PEOPLE }]}
            mutationDoc={CREATE_PERSON}
            input={newPerson}
          />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('result'))

      const updatedCache = cache.extract()
      const doesNormalizedCacheHaveAllPeople = [
        ...initialPeople,
        newPerson,
      ].every(({ _id }) => updatedCache[`Person:${_id}`])

      const doesRootQueryHaveAllPeople =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length + 1

      expect(doesRootQueryHaveAllPeople).toBe(true)
      expect(doesNormalizedCacheHaveAllPeople).toBe(true)
    })

    it('Does not update cached data without refetch', async () => {
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
          <MutatePersonComponent
            mutationDoc={CREATE_PERSON}
            input={newPerson}
          />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('result'))

      const updatedCache = cache.extract()

      const areAllInitialPeopleInTheCache = initialPeople.every(
        ({ _id }) => updatedCache[`Person:${_id}`]
      )

      const areNumPeopleInCacheTheSame =
        initialPeople.length ===
        Object.keys(updatedCache).filter((el) => el.includes('Person:')).length

      const hasNormalizedCacheStayedTheSame =
        areAllInitialPeopleInTheCache && areNumPeopleInCacheTheSame

      const hasRootQueryCacheStayedTheSame =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length

      expect(hasRootQueryCacheStayedTheSame).toBe(true)
      expect(hasNormalizedCacheStayedTheSame).toBe(true)
    })
  })

  describe('UPDATE_PERSON', () => {
    it('Updates person in cache', async () => {
      const cache = new InMemoryCache().restore(initialCache)

      const UPDATE_ID = '1'
      const updatedPersonInput = {
        _id: UPDATE_ID,
        createdOn: '2020-07-01T15:55:42.000Z',
        updatedOn: '2021-08-01T15:55:42.000Z',
        firstName: 'Danielle Updated',
        lastName: 'Fishman Updated',
        nationalProviderIdentifier: 123,
        physicianProfileId: 456,
      }

      const clonedInitialPeople = _.cloneDeep(initialPeople)
      clonedInitialPeople[0] = { ...updatedPersonInput, __typename: 'Person' }

      const mutationMocks = [
        {
          request: {
            query: UPDATE_PERSON,
            variables: { input: updatedPersonInput },
          },
          result: {
            data: {
              updatePerson: {
                ...updatedPersonInput,
                __typename: 'UpdatePersonPayload',
              },
            },
          },
        },
        {
          request: {
            query: GET_PEOPLE,
          },
          result: {
            data: {
              people: clonedInitialPeople,
            },
          },
        },
      ]

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={mutationMocks}>
          <MutatePersonComponent
            refetchQueries={[{ query: GET_PEOPLE }]}
            mutationDoc={UPDATE_PERSON}
            input={updatedPersonInput}
          />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('result'))

      const updatedCache = cache.extract()

      const updatedPersonInNormalizedCache = updatedCache[`Person:${UPDATE_ID}`]

      const doesNormalizedCacheHaveAllPeople = [
        ...initialPeople,
        updatedPersonInput,
      ].every(({ _id }) => updatedCache[`Person:${_id}`])

      const doesRootQueryHaveAllPeople =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length

      expect(
        updatedPersonInNormalizedCache.firstName === 'Danielle Updated'
      ).toBe(true)
      expect(doesRootQueryHaveAllPeople).toBe(true)
      expect(doesNormalizedCacheHaveAllPeople).toBe(true)
    })
  })

  describe('DELETE_PERSON', () => {
    it('Removes person from ROOT_QUERY cache, but not normalized cache', async () => {
      const cache = new InMemoryCache().restore(initialCache)

      const DELETE_ID = '1'

      const deletePersonInput = { _id: DELETE_ID }

      const { __typename, ...personToBeDeleted } = initialPeople[0]
      const deletePersonPayload = {
        ...personToBeDeleted,
        __typename: 'DeletePersonPayload',
      }

      const mutationMocks = [
        {
          request: {
            query: DELETE_PERSON,
            variables: { input: deletePersonInput },
          },
          result: {
            data: {
              deletePerson: deletePersonPayload,
            },
          },
        },
        {
          request: {
            query: GET_PEOPLE,
          },
          result: {
            data: {
              people: initialPeople.slice(1),
            },
          },
        },
      ]

      const { getByTestId } = render(
        <MockedProvider cache={cache} mocks={mutationMocks}>
          <MutatePersonComponent
            refetchQueries={[{ query: GET_PEOPLE }]}
            mutationDoc={DELETE_PERSON}
            input={deletePersonInput}
          />
        </MockedProvider>
      )

      await waitFor(() => getByTestId('result'))

      const updatedCache = cache.extract()

      const doesNormalizedCacheHaveAllPeople = [
        ...initialPeople,
        deletePersonInput,
      ].every(({ _id }) => updatedCache[`Person:${_id}`])

      const doesRootQueryHaveEveryoneExceptDeletedPerson =
        updatedCache.ROOT_QUERY.people.length === initialPeople.length - 1 &&
        !updatedCache.ROOT_QUERY.people.find(
          ({ __ref }) => __ref === `Person:${DELETE_ID}`
        )

      expect(doesRootQueryHaveEveryoneExceptDeletedPerson).toBe(true)
      expect(doesNormalizedCacheHaveAllPeople).toBe(true)
    })
  })
})
