import React from 'react'
import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react'

import initialCache from './initialCache'
import initialPeople from './initialPeople'

import GetPeopleComponent from './components/GetPeopleComponent'
import CreatePersonComponent from './components/CreatePersonComponent'

import { GET_PEOPLE } from 'frontend/api/queries'
import { CREATE_PERSON } from 'frontend/api/mutations'

describe('Person Endpoints', () => {
  it.todo('should update the cache correctly from empty when query')

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

    // ! manual hack to get mutation, so we can await it. Never do this in an actual component.
    let myMutation = {}

    render(
      <MockedProvider cache={cache} mocks={mutationMocks}>
        <CreatePersonComponent person={newPerson} myMutation={myMutation} />
      </MockedProvider>
    )

    await myMutation.createPerson()
    const updatedCache = cache.extract()
    const doesNewPersonExistInCache = Boolean(updatedCache[`Person:${_id}`]._id)
    expect(doesNewPersonExistInCache).toBe(true)
  })
})
