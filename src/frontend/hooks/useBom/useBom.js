import { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import BOID_QUERY_MAP from './boid-query-map'

import {
  GET_BOM_SCHEMA,
} from './../../api/queries'

export default (boid, entityId) => {
  const [schema, setSchema] = useState({})

  const { loading: loadingSchema } = useQuery(GET_BOM_SCHEMA, {
    variables: { boid },
    onCompleted: data => {
      const { bomSchema } = data

      setSchema(bomSchema)
    }
  })

  const { loading: loadingEntity, data } = useQuery(BOID_QUERY_MAP[boid])

  let entity = {}
  if (!loadingEntity) {
    const queryResult = data[Object.keys(data)[0]]

    // ! needed because we always return all orgs then pick them out for cache mgmt
    entity = Array.isArray(queryResult)
      ? queryResult.find(({ _id }) => _id === entityId)
      : queryResult
  }

  return {
    schema,
    entity,
    loading: loadingSchema || loadingEntity,
  }
}
