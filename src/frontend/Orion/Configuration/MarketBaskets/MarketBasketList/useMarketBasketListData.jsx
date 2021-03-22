import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'
import { useIndicationsMap } from '../data-hooks'

const useMarketBasketListData = () => {
  const marketBasketQuery = useQuery(GET_MARKET_BASKETS)

  const [hydratedMbs, setHydratedMbData] = useState([])
  const [isHydrating, setIsHydrating] = useState(true)

  const {
    data: indicationsMap,
    loading: isIndicationMapCreating,
  } = useIndicationsMap()

  const areAnyMapsLoadingOrEmpty = [
    isIndicationMapCreating || _.isEmpty(indicationsMap),
  ].some(bool => bool)

  useEffect(() => {
    if (marketBasketQuery.data && !areAnyMapsLoadingOrEmpty) {
      const hydratedMbs = getHydratedMbs(marketBasketQuery.data, { indicationsMap })

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

const getHydratedMbs = (data, { indicationsMap }) => {
  return data.marketBaskets.map(({
    indication,
    ...rest
  }) => ({
    indication: indicationsMap[indication],
    ...rest
  }))
}

export default useMarketBasketListData
