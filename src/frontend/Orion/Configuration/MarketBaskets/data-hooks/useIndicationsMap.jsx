import _ from 'lodash'
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_SOURCE_INDICATIONS,
} from 'frontend/api/queries'

const useIndicationsMap = () => {
  const indicationQuery = useQuery(GET_SOURCE_INDICATIONS)
  const [indMap, setIndMap] = useState({})
  const [isIndMapCreating, setIsIndMapCreating] = useState(true)

  useEffect(() => {
    if (!indicationQuery.loading) {
      const map = _.keyBy(indicationQuery.data.indications, 'uuid')

      setIndMap(map)
      setIsIndMapCreating(false)
    }
  }, [indicationQuery.data, indicationQuery.loading])

  return {
    data: indMap,
    loading: isIndMapCreating,
  }
}

export default useIndicationsMap
