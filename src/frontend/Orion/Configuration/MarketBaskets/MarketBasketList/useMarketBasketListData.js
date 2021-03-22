import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_MARKET_BASKETS,
  GET_SOURCE_INDICATIONS,
} from 'frontend/api/queries'

const useMarketBasketListData = () => {
  const marketBasketQuery = useQuery(GET_MARKET_BASKETS)
  const indicationQuery = useQuery(GET_SOURCE_INDICATIONS)

  const [indMap, setIndMap] = useState({})
  const [hydratedMbs, setHydratedMbData] = useState([])
  const [isHydrating, setIsHydrating] = useState(true)

  const areAnyMapsLoadingOrEmpty = [
    indicationQuery.loading || _.isEmpty(indMap),
  ].some(bool => bool)

  useEffect(() => {
    if (!marketBasketQuery.loading && !indicationQuery.loading) {
      const map = _.keyBy(indicationQuery.data.indications, 'uuid')

      setIndMap(map)
    }
  }, [marketBasketQuery.loading, indicationQuery.loading])

  useEffect(() => {
    if (marketBasketQuery.data && !areAnyMapsLoadingOrEmpty) {
      const hydratedMbs = getHydratedMbs(marketBasketQuery.data, { indMap })

      setHydratedMbData(hydratedMbs)
      setIsHydrating(false)
    }
  }, [marketBasketQuery.data, areAnyMapsLoadingOrEmpty])

  let marketBasketsData = []
  if (!isHydrating) {
    marketBasketsData = hydratedMbs
  } else if (!marketBasketQuery.loading) {
    marketBasketsData = marketBasketQuery.data.marketBaskets
  }

  const data = {
    marketBaskets: {
      data: marketBasketsData,
      loading: marketBasketQuery.loading,
      isHydrating,
    }
  }

  const mutations = {

  }

  return [
    data,
    mutations,
  ]
}

const getHydratedMbs = (data, { indMap }) => {
  return data.marketBaskets.map(({
    indication,
    ...rest
  }) => ({
    indication: indMap[indication],
    ...rest
  }))
}

export default useMarketBasketListData
