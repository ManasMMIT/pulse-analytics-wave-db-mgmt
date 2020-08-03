import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react/hooks'

import { GET_PEOPLE } from 'frontend/api/queries'
import { CREATE_PERSON } from 'frontend/api/mutations'

export default ({ person }) => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    variables: { input: person },
    refetchQueries: [{ query: GET_PEOPLE }],
  })

  useEffect(() => {
    createPerson()
  }, [])

  return null
}
