import React from 'react'
import { useMutation } from '@apollo/client/react/hooks'

import createPersonDoc from '../gql-tags/createPersonGraphQLTag'
import getPeopleDoc from '../gql-tags/getPeopleGraphQLTag'

export default ({ person }) => {
  const [createPerson] = useMutation(createPersonDoc, {
    variables: {
      input: person,
    },
    awaitRefetchQueries: true, // ! TESTING POST-REFETCH WORLD
    refetchQueries: [{ query: getPeopleDoc }],
  })

  return (
    <button data-testid="button-mutate" onClick={createPerson}>
      create
    </button>
  )
}
