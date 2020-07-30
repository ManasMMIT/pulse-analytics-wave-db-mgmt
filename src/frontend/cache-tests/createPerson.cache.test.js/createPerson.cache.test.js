import React from 'react'
import { ObjectId } from 'mongodb'

import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render, fireEvent } from '@testing-library/react'

import initialCache from './initialCache.json'
import initialPeople from './initialPeople'

import getPeopleDoc from './gql-tags/getPeopleGraphQLTag'
import createPersonDoc from './gql-tags/createPersonGraphQLTag'

import GetPeopleComponent from './components/GetPeopleComponent'
import CreatePersonComponent from './components/CreatePersonComponent'

const waitForResponse = () => new Promise((res) => setTimeout(res, 0))

describe('Create Person', () => {
  it('should update the cache correctly when triggered with refetch', async () => {
    const cache = new InMemoryCache().restore(initialCache)

    const queryMocks1 = {
      request: {
        query: getPeopleDoc,
      },
      result: {
        data: {
          people: initialPeople,
        },
      },
    }

    render(
      <MockedProvider cache={cache} mocks={[queryMocks1]}>
        <GetPeopleComponent />
      </MockedProvider>
    )

    const newObjId = new ObjectId()

    const newPerson = {
      _id: newObjId, // NOT ACTUALLY DONE IN THE APP
      firstName: 'Cache Integration',
      lastName: 'Test',
    }
    const newCachedPerson = {
      _id: newObjId.toString(),
      firstName: newPerson.firstName,
      __typename: 'Person',
    }

    const mutationMocks = [
      {
        request: {
          query: createPersonDoc,
          variables: { input: newPerson },
        },
        result: {
          data: {
            createPerson: newCachedPerson,
          },
        },
      },
      {
        request: {
          query: getPeopleDoc,
        },
        result: {
          data: {
            people: [...initialPeople, newCachedPerson],
          },
        },
      },
    ]

    const { getByTestId } = render(
      <MockedProvider cache={cache} mocks={mutationMocks}>
        <CreatePersonComponent person={newPerson} />
      </MockedProvider>
    )

    const button = getByTestId('button-mutate')
    fireEvent.click(button)
    await waitForResponse()

    const updatedCache = cache.extract()

    expect(!!updatedCache[`Person:${newObjId.toString()}`]._id).toBe(true)
  })
})
