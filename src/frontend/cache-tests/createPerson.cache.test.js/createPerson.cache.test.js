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

describe('Create Person', () => {
  jest.setTimeout(500000)
  it('should update the cache correctly when triggered with refetch', async () => {
    const cache = new InMemoryCache().restore(initialCache)

    const newObjId = '123'

    const newPerson = {
      _id: newObjId, // NOT ACTUALLY DONE IN THE APP
      firstName: 'Cache Integration',
      lastName: 'Test',
    }
    const newCachedPerson = {
      _id: newObjId,
      firstName: newPerson.firstName,
      __typename: 'Person',
    }

    const createPersonPayload = {
      _id: newObjId,
      firstName: newPerson.firstName,
      __typename: 'CreatePersonPayload',
    }

    const mutationMocks = [
      {
        request: {
          query: CREATE_PERSON,
          variables: { input: newPerson },
        },
        result: {
          data: {
            createPerson: createPersonPayload,
          },
        },
      },
      {
        request: {
          query: GET_PEOPLE,
        },
        result: {
          data: {
            people: [...initialPeople, newCachedPerson],
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

    expect(!!updatedCache[`Person:${newObjId}`]._id).toBe(true)
  })
})
