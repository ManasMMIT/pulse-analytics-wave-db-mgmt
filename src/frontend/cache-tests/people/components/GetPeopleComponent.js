import React from 'react'
import { useQuery } from '@apollo/client/react/hooks'

import { GET_PEOPLE } from 'frontend/api/queries'

export default () => {
  const { data, loading } = useQuery(GET_PEOPLE)

  return loading ? (
    <div>loading</div>
  ) : (
    <div>
      {data.people.map(({ _id, firstName, lastName }) => (
        <div key={_id}>{firstName + ' ' + lastName}</div>
      ))}
    </div>
  )
}
