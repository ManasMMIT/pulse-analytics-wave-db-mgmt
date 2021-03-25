import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'
import { CREATE_MARKET_BASKET, UPDATE_MARKET_BASKET } from 'frontend/api/mutations'
import { useIndicationsMap, useProductsMap, useTeamsMap } from './useEntityMap'

const getHydratedMbProducts = (products, productsMap) => {
  if (_.isEmpty(productsMap)) return products

  return products.map(id => productsMap[id])
}

const getHydratedIndication = (indication, indicationsMap) => {
  return indicationsMap[indication]
    ? indicationsMap[indication].name
    : null
}

const getHydratedMbs = (marketBaskets, {
  indicationsMap,
  productsMap,
  teamsMap,
}) => {
  return marketBaskets.map(({
    indication,
    products,
    ...rest
  }) => ({
    indication: getHydratedIndication(indication, indicationsMap),
    products: getHydratedMbProducts(products, productsMap),
    ...rest
  }))
}

const useData = ({ marketBasketId }) => {
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

  const {
    data: teamsMap,
    loading: isTeamsMapCreating,
  } = useTeamsMap()

  const areAnyMapsLoadingOrEmpty = [
    isIndicationMapCreating || _.isEmpty(indicationsMap),
    isProductsMapCreating || _.isEmpty(productsMap),
    isTeamsMapCreating || _.isEmpty(teamsMap),
  ].some(bool => bool)

  useEffect(() => {
    if (marketBasketQuery.data) {
      const marketBaskets = marketBasketId
        ? [marketBasketQuery.data.marketBaskets.find(({ id }) => id === marketBasketId)]
        : marketBasketQuery.data.marketBaskets

      const hydratedMbs = getHydratedMbs(marketBaskets, {
        indicationsMap,
        productsMap,
        teamsMap,
      })

      setHydratedMbData(hydratedMbs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketBasketQuery.data, areAnyMapsLoadingOrEmpty])

  let raw = []
  if (!marketBasketQuery.loading) {
    raw = marketBasketId
      ? [marketBasketQuery.data.marketBaskets.find(({ id }) => id === marketBasketId)]
      : marketBasketQuery.data.marketBaskets
  }

  return {
    marketBaskets: {
      data: {
        raw,
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

export default (props = {}) => [useData(props), useMutations()]

/*
  FORKS:

  A.
    Individual queries
    1. Query required data
      - query market baskets
      - query products
      - query indications
      - query all the things, separately
    2. Create maps -- e.g., const productsMap = { '1232-421': { id, name, ...prodFields } }
    3. Hydration step: use maps to hydrate market basket data
      - hydrate or reHydrate if any map base data changes || market baskets change
  B.
    1. Query market baskets fully hydrated
*/
