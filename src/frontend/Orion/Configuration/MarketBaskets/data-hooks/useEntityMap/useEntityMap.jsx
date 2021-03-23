import _ from 'lodash'
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

const useEntityMap = ({
  queryDoc,
  mapKey,
}) => {
  const query = useQuery(queryDoc)
  const [map, setMap] = useState({})
  const [isMapCreating, setIsMapCreating] = useState(true)

  useEffect(() => {
    if (!query.loading) {
      const map = _.keyBy(Object.values(query.data)[0], mapKey)

      setMap(map)
      setIsMapCreating(false)
    }
  }, [query.data, query.loading])

  return {
    data: map,
    loading: isMapCreating,
  }
}

export default useEntityMap
