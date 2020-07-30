import React from 'react'
import { useQuery } from '@apollo/client/react/hooks'

import getPeopleDoc from '../gql-tags/getPeopleGraphQLTag'

export default () => {
  const { data, loading } = useQuery(getPeopleDoc)

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
