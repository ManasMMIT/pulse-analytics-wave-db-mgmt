import React from 'react'
import { useQuery } from '@apollo/client/react/hooks'

import { GET_PEOPLE } from 'frontend/api/queries'

export default ({ optionsObject = {} }) => {
  const { data, loading } = useQuery(GET_PEOPLE, optionsObject)

  return loading ? (
    <div>loading</div>
  ) : (
    <div data-testid="list">
      {data.people.map(({ _id, firstName, lastName }) => (
        <div key={_id}>{firstName + ' ' + lastName}</div>
      ))}
    </div>
  )
}
