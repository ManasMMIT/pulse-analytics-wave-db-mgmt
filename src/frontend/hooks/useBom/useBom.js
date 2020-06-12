import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import BOID_QUERY_MAP from './boid-query-map'

import {
  GET_BOM_SCHEMA,
} from './../../api/queries'

export default (boId, entityId) => {
  const { loading: loadingSchema, data: schemaData } = useQuery(GET_BOM_SCHEMA, {
    variables: { boId },
    onError: e => alert(`Maybe the business object doesn't have modal in modal mgmt\nFull Error: ${e}`),
  })

  let loadingEntity, entityData
  try {
    const { loading, data } = useQuery(BOID_QUERY_MAP[boId])

    loadingEntity = loading
    entityData = data
  } catch(e) {
    alert(`Business object likely has no modal button built for it\nFull Error: ${e}`)

    return {
      schema: {},
      entity: {},
      loading: false
    }
  }


  let entity = {}
  if (!loadingEntity && !_.isEmpty(entityData)) {
    const queryResult = entityData[Object.keys(entityData)[0]]

    // ! needed because we always return all orgs then pick them out for cache mgmt
    entity = Array.isArray(queryResult)
      ? queryResult.find(({ _id }) => _id === entityId) || {}
      : queryResult
  }

  let schema = {}
  if (!loadingSchema && schemaData) schema = schemaData.bomSchema || {}

  return {
    schema,
    entity,
    loading: loadingSchema || loadingEntity,
  }
}
