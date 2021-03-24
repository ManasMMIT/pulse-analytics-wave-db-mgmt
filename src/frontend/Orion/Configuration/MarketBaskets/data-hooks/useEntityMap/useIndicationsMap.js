// TODO: Migrate GQL to a vega query endpoint
import useEntityMap from './useEntityMap'

import {
  GET_SOURCE_INDICATIONS,
} from 'frontend/api/queries'

const useIndicationsMap = () => {
  return useEntityMap({
    queryDoc: GET_SOURCE_INDICATIONS,
    mapKey: 'uuid',
  })
}

export default useIndicationsMap
