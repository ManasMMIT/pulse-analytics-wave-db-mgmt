import React from 'react'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react/hooks'

export default ({ input, mutationDoc, refetchQueries = [] }) => {
  const [mutatePerson, { called, loading }] = useMutation(mutationDoc, {
    variables: { input },
    awaitRefetchQueries: true, // ! test breaks if not awaited
    refetchQueries,
  })

  useEffect(() => {
    mutatePerson()
  }, [])

  if (!called || loading) return <div>loading</div>

  return <div data-testid="result" />
}
