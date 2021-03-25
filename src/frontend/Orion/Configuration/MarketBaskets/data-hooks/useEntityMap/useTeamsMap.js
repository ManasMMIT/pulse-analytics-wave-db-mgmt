// TODO: Migrate GQL to a vega query endpoint
import useEntityMap from './useEntityMap'

import {
  GET_TEAMS,
} from 'frontend/api/queries'

const useIndicationsMap = () => {
  return useEntityMap({
    queryDoc: GET_TEAMS,
    mapKey: 'uuid',
  })
}

export default useIndicationsMap
