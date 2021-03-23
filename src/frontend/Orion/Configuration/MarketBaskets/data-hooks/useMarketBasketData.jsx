// TODO: FIGURE OUT IF THIS SHOULD JUST BE:
// ! useMarketBasketData
// after getting detail page up and running

// TODO: Make it easy for frontend team to stub values inside hook?
// or maybe just where hook is used

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
import { useIndicationsMap, useProductsMap } from './useEntityMap'

const getHydrateMbProducts = (products, productsMap) => {
  if (_.isEmpty(productsMap)) return products

  return products.map(id => productsMap[id].generic_name).join(', ')
}

const getHydratedIndication = (indication, indicationsMap) => {
  return indicationsMap[indication]
    ? indicationsMap[indication].name
    : null
}

const getHydratedMbs = (data, { indicationsMap, productsMap }) => {

  return data.marketBaskets.map(({
    indication,
    products,
    ...rest
  }) => ({
    indication: getHydratedIndication(indication, indicationsMap),
    products: getHydrateMbProducts(products, productsMap),
    ...rest
  }))
}

const useData = () => {
  const marketBasketQuery = useQuery(GET_MARKET_BASKETS)

  const [hydratedMbs, setHydratedMbData] = useState([])

  const {
    data: indicationsMap,
    loading: isIndicationMapCreating,
  } = useIndicationsMap()

  const {
    data: productsMap,
    loading: isProductsMapCreating,
  } = useProductsMap()

  const areAnyMapsLoadingOrEmpty = [
    isIndicationMapCreating || _.isEmpty(indicationsMap),
    isProductsMapCreating || _.isEmpty(productsMap),
  ].some(bool => bool)

  useEffect(() => {
    if (marketBasketQuery.data) {
      const hydratedMbs = getHydratedMbs(marketBasketQuery.data, { indicationsMap, productsMap })

      setHydratedMbData(hydratedMbs)
    }
  }, [marketBasketQuery.data, areAnyMapsLoadingOrEmpty])

  return {
    marketBaskets: {
      data: {
        raw: (marketBasketQuery.data || {}).marketBaskets,
        hydrated: hydratedMbs,
      },
      loading: marketBasketQuery.loading,
    }
  }
}

const useMutations = () => {
  const [create] = useMutation(CREATE_MARKET_BASKET, {
    refetchQueries: [{ query: GET_MARKET_BASKETS }],
    onError: alert,
  })

  const [update] = useMutation(UPDATE_MARKET_BASKET, {
    refetchQueries: [{ query: GET_MARKET_BASKETS }],
    onError: alert,
  })

  return {
    marketBasket: {
      create,
      update,
    }
  }
}

export default () => [useData(), useMutations()]

