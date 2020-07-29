import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import gql from 'graphql-tag'
import { create, act } from 'react-test-renderer'

import { useQuery } from '@apollo/react-hooks'

// Make sure the query is also exported -- not just the component
export const GET_DOG_QUERY = gql`
  query GetDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`

export function Dog({ name }) {
  const { loading, error, data } = useQuery(GET_DOG_QUERY, {
    variables: { name },
  })
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  return (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  )
}

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: 'Buck',
      },
    },
    result: {
      data: {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      },
    },
  },
]

it('renders without error', () => {
  act(() => {
    create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>
    )
  })
})

// ! Will throw an error for `act` because we're not waiting on the component to finish mounting before leaving the callback
// ! for this test, we want to leave the callback early
it('should render loading state initially', () => {
  let tree
  act(() => {
    tree = create(
      <MockedProvider mocks={[]}>
        <Dog name="Buck" />
      </MockedProvider>
    )
  })

  tree = tree.toJSON()
  expect(tree.children).toContain('Loading...')
})

it('should render dog', async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: 'Buck' },
    },
    result: {
      data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
    },
  }

  let component
  await act(async () => {
    component = create(
      <MockedProvider mocks={[dogMock]} addTypename={false}>
        <Dog name="Buck" />
      </MockedProvider>
    )

    await new Promise((resolve) => setTimeout(resolve, 20))
  })

  await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

  const p = component.root.findByType('p')
  expect(p.children.join('')).toContain('Buck is a poodle')
})
