import React from 'react'
import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react'

import initialCache from './initialCache.json'
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

    const newObjId = '123'

    const newPerson = {
      _id: newObjId,
      firstName: 'Cache Integration',
      lastName: 'Test',
    }

    const postMutationPeople = [
      ...initialPeople,
      { _id: newObjId, firstName: newPerson.firstName, __typename: 'Person' },
    ]

    const mutationMocks = [
      {
        request: {
          query: CREATE_PERSON,
          variables: { input: newPerson },
        },
        result: {
          data: {
            createPerson: {
              _id: newObjId,
              firstName: newPerson.firstName,
              lastName: 'Test',
              __typename: 'CreatePersonPayload',
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
            people: postMutationPeople,
          },
        },
      },
    ]

    let myMutation = {}

    render(
      <MockedProvider cache={cache} mocks={mutationMocks}>
        <CreatePersonComponent person={newPerson} myMutation={myMutation} />
      </MockedProvider>
    )

    await myMutation.createPerson()
    const updatedCache = cache.extract()
    const doesNewPersonExistInCache = Boolean(
      updatedCache[`Person:${newObjId}`]._id
    )
    expect(doesNewPersonExistInCache).toBe(true)
  })
})
