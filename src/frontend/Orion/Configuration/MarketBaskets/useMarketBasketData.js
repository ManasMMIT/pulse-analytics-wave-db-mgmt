import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_SOURCE_INDICATIONS,
  GET_SOURCE_PRODUCTS,
  GET_MARKET_BASKETS,
} from 'frontend/api/queries'

const useMarketBasketData = () => {
  const { data: mbData, loading: mbLoading } = useQuery(GET_MARKET_BASKETS)
  const { data: indData, loading: indLoading } = useQuery(GET_SOURCE_INDICATIONS)
  const [indMap, setIndMap] = useState({})

  useEffect(() => {
    if (!mbLoading && !indLoading) {
      const indsByUuidMap = _.keyBy(indData.indications, 'uuid')

      setIndMap(indsByUuidMap)
    }
  }, [mbLoading, indLoading])

  const { data: productData, loading: productLoading } = useQuery(GET_SOURCE_PRODUCTS)
  const [productMap, setProductMap] = useState({})

  useEffect(() => {
    if (!mbLoading && !productLoading) {
      const productsByUuidMap = _.keyBy(productData.products, 'uuid')

      setProductMap(productsByUuidMap)
    }
  }, [mbLoading, productLoading])

  const areAnyMapsLoadingOrEmpty = [
    indLoading || _.isEmpty(indMap),
    productLoading || _.isEmpty(productMap),
  ].some(bool => bool)

  const [hydratedMbs, setHydratedMbData] = useState([])

  useEffect(() => {
    if (mbData && !areAnyMapsLoadingOrEmpty) {

      const hydratedMbs = mbData.marketBaskets.map(({
        indication,
        products,
        ...rest
      }) => ({
        indication: indMap[indication],
        products: products.map(uuid => productMap[uuid]),
        ...rest
      }))

      setHydratedMbData(hydratedMbs)
    }
  }, [mbData, areAnyMapsLoadingOrEmpty])

  return {
    marketBaskets: hydratedMbs,
    // ? not sure about load state yet
    // * thinking if maps aren't ready or hydratedMbs haven't been set at least once to have data
    loading: areAnyMapsLoadingOrEmpty || _.isEmpty(hydratedMbs),
  }
}

export default useMarketBasketData
