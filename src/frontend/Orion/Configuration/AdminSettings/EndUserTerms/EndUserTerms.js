import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { GET_END_USER_TERMS } from 'frontend/api/queries'

const EndUserTerms = () => {
  const { data, loading } = useQuery(GET_END_USER_TERMS)

  console.log(data)

  return (
    <div>
      <h1>End User Terms Management</h1>
    </div>
  )
}

export default EndUserTerms
