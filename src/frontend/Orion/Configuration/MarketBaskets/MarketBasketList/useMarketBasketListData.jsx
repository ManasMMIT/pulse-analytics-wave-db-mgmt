/* 
  ? Premise-lvl ideas:
    * These view hooks will output all data
    * needed for a page to completely render.
    * 
    * These view hooks can safely be used for
    * any children components in a view without making
    * additional network requests.
    * 
    * Mutations are tied to a view's data -- the idea being
    * the page will need to either refetch/re-hydrate its data
    * post-op or will need data to populate forms with the data.
*/

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'
import { CREATE_MARKET_BASKET, UPDATE_MARKET_BASKET } from 'frontend/api/mutations'
import { useIndicationsMap } from '../data-hooks'

const getHydratedMbs = (data, { indicationsMap }) => {
  return data.marketBaskets.map(({
    indication,
    ...rest
  }) => ({
    indication: indicationsMap[indication],
    ...rest
  }))
}

const useData = () => {
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

  return {
    marketBaskets: {
      data: marketBasketsData,
      loading: marketBasketQuery.loading,
      isHydrating,
    }
  }
}

const useMutations = () => {
  const [save] = useMutation(CREATE_MARKET_BASKET, {
    refetchQueries: [{ query: GET_MARKET_BASKETS }],
    onError: alert,
  })

  const [update] = useMutation(UPDATE_MARKET_BASKET, {
    refetchQueries: [{ query: GET_MARKET_BASKETS }],
    onError: alert,
  })

  return {
    marketBasket: {
      save,
      update,
    }
  }
}

const useMarketBasketListData = () => [useData(), useMutations()]

export default useMarketBasketListData
