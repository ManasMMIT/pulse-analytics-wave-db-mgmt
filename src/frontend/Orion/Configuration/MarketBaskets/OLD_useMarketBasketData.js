import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

// ? Might want to fetch heavy vega collections when user first navigates to orion
import {
  GET_SOURCE_INDICATIONS,
  GET_VEGA_PRODUCTS,
  GET_VEGA_REGIMENS,
  GET_MARKET_BASKETS,
  GET_MARKET_BASKETS_SUBSCRIPTIONS,
} from 'frontend/api/queries'

const useMarketBasketData = () => {
  const { data: mbData, loading: mbLoading } = useQuery(GET_MARKET_BASKETS)
  // ! change to vega query?
  const { data: indData, loading: indLoading } = useQuery(GET_SOURCE_INDICATIONS)
  const { data: vegaProdData, loading: vegaProdLoading } = useQuery(GET_VEGA_PRODUCTS)
  const { data: vegaRegimenData, loading: vegaRegimenLoading } = useQuery(GET_VEGA_REGIMENS)
  const { data: mbSubData, loading: mbSubLoading } = useQuery(GET_MARKET_BASKETS_SUBSCRIPTIONS)

  const [indMap, setIndMap] = useState({})
  const [productMap, setProductMap] = useState({})
  const [regimenMap, setRegimenMap] = useState({})
  const [mbSubMap, setMbSubMap] = useState({})
  const [hydratedMbs, setHydratedMbData] = useState([])

  const areAnyMapsLoadingOrEmpty = [
    indLoading || _.isEmpty(indMap),
    vegaProdLoading || _.isEmpty(productMap),
    vegaRegimenLoading || _.isEmpty(regimenMap),
  ].some(bool => bool)

  useEffect(
    getMapSetterCallback({
      mbLoading,
      mapDataLoading: indLoading,
      setMapData: setIndMap,
      data: indData,
      dataKey: 'indications',
      groupKey: 'uuid',
    }),
    [mbLoading, indLoading]
  )

  useEffect(
    getMapSetterCallback({
      mbLoading,
      mapDataLoading: vegaProdLoading,
      setMapData: setProductMap,
      data: vegaProdData,
      dataKey: 'vegaProducts',
      groupKey: 'id',
    }),
    [mbLoading, vegaProdLoading]
  )

  useEffect(
    getMapSetterCallback({
      mbLoading,
      mapDataLoading: vegaRegimenLoading,
      setMapData: setRegimenMap,
      data: vegaRegimenData,
      dataKey: 'vegaRegimens',
      groupKey: 'id',
    }),
    [mbLoading, vegaRegimenLoading]
  )

  useEffect(
    getMapSetterCallback({
      mbLoading,
      mapDataLoading: vegaRegimenLoading,
      setMapData: setRegimenMap,
      data: vegaRegimenData,
      dataKey: 'vegaRegimens',
      groupKey: 'id',
    }),
    [mbLoading, vegaRegimenLoading]
  )

  useEffect(
    getMapSetterCallback({
      mbLoading,
      mapDataLoading: mbSubLoading,
      setMapData: setMbSubMap,
      data: mbSubData,
      dataKey: 'marketBasketsSubscriptions',
      groupKey: 'id',
    }),
    [mbLoading, mbSubLoading]
  )

  useEffect(() => {
    if (mbData && !areAnyMapsLoadingOrEmpty) {
      const hydratedMbs = getHydratedMbs({
        mbData,
        mbSubMap,
        indMap,
        productMap,
        regimenMap,
      })

      setHydratedMbData(hydratedMbs)
    }
  }, [mbData, areAnyMapsLoadingOrEmpty])

  return {
    marketBaskets: hydratedMbs,
    loading: areAnyMapsLoadingOrEmpty || _.isEmpty(hydratedMbs),
  }
}

const getMapSetterCallback = ({ mbLoading, mapDataLoading, setMapData, data, dataKey, groupKey = 'id' }) => () => {
  if (!mbLoading && !mapDataLoading) {
    const map = _.keyBy(data[dataKey], groupKey)

    setMapData(map)
  }
}

const getHydratedMbs = ({ mbData, indMap, productMap, regimenMap, mbSubMap }) => {
  return mbData.marketBaskets.map(({
    indication,
    products,
    team_subscriptions,
    ...rest
  }) => ({
    indication: indMap[indication],
    products: products.map(id => {
      const product = productMap[id]

      return {
        ...product,
        regimens: product.regimens.map(id => regimenMap[id]),
      }
    }),
    team_subscriptions: team_subscriptions.map(id => mbSubMap[id]),
    ...rest
  }))
}

export default useMarketBasketData
