import Spinner from 'frontend/components/Spinner'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

import useMarketBasketData from './../useMarketBasketData'

const MarketBasketDetail = () => {
  const { marketBasketId } = useParams()
  const { marketBaskets, loading } = useMarketBasketData()
  if (loading) return <Spinner />

  const marketBasket = marketBaskets.find(({ id }) => id === marketBasketId)

  return (
    <div>
      <Link to="/orion/configuration/market-baskets/">Back</Link>
      <h1>{marketBasket.name}</h1>
    </div>
  )
}

export default MarketBasketDetail
