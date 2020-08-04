import React from 'react'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react/hooks'

import { GET_PEOPLE } from 'frontend/api/queries'
import { CREATE_PERSON } from 'frontend/api/mutations'

export default ({ person }) => {
  const [createPerson, { called, loading }] = useMutation(CREATE_PERSON, {
    variables: { input: person },
    awaitRefetchQueries: true, // ! test breaks if not awaited
    refetchQueries: [{ query: GET_PEOPLE }],
  })

  useEffect(() => {
    createPerson()
  }, [])

  if (!called || loading) return <div>loading</div>

  return <div data-testid="result" />
}
