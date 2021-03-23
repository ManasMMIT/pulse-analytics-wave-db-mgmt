// TODO: Migrate GQL to a vega query endpoint
import useEntityMap from './useEntityMap'

import {
  GET_VEGA_PRODUCTS,
} from 'frontend/api/queries'

const useProductsMap = () => {
  return useEntityMap({
    queryDoc: GET_VEGA_PRODUCTS,
    mapKey: 'id',
  })
}

export default useProductsMap
