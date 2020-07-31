import React from 'react'
import { useMutation } from '@apollo/client/react/hooks'

import createPersonDoc from '../gql-tags/createPersonGraphQLTag'
import getPeopleDoc from '../gql-tags/getPeopleGraphQLTag'

// TODO: Add list of people to this component to directly test component render after mutation
export default ({ person, myMutation }) => {
  const [createPerson] = useMutation(createPersonDoc, {
    variables: {
      input: person,
    },
    awaitRefetchQueries: true, // ! TESTING POST-REFETCH WORLD
    refetchQueries: [{ query: getPeopleDoc }],
  })

  myMutation.createPerson = createPerson

  return (
    <button data-testid="button-mutate" onClick={createPerson}>
      create
    </button>
  )
}
