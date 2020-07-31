import React from 'react'
import { useMutation } from '@apollo/client/react/hooks'

import { GET_PEOPLE } from 'frontend/api/queries'
import { CREATE_PERSON } from 'frontend/api/mutations'

// TODO: Add list of people to this component to directly test component render after mutation
export default ({ person, myMutation }) => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    variables: {
      input: person,
    },
    awaitRefetchQueries: true, // ! TESTING POST-REFETCH WORLD
    refetchQueries: [{ query: GET_PEOPLE }],
  })

  myMutation.createPerson = createPerson

  return (
    <button data-testid="button-mutate" onClick={createPerson}>
      create
    </button>
  )
}
