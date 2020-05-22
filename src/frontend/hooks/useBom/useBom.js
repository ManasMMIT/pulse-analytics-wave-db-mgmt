import { useQuery } from '@apollo/react-hooks'

import BOID_QUERY_MAP from './boid-query-map'

import {
  GET_BOM_SCHEMA,
} from './../../api/queries'

export default (boId, entityId) => {
  const { loading: loadingSchema, data: schemaData } = useQuery(GET_BOM_SCHEMA, {
    variables: { boId }
  })

  const { loading: loadingEntity, data } = useQuery(BOID_QUERY_MAP[boId])

  let entity = {}
  if (!loadingEntity) {
    const queryResult = data[Object.keys(data)[0]]

    // ! needed because we always return all orgs then pick them out for cache mgmt
    entity = Array.isArray(queryResult)
      ? queryResult.find(({ _id }) => _id === entityId) || {}
      : queryResult
  }

  let schema = {}
  if (!loadingSchema) schema = schemaData.bomSchema

  return {
    schema,
    entity,
    loading: loadingSchema || loadingEntity,
  }
}
