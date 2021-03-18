import Spinner from 'frontend/components/Spinner'
import _ from 'lodash'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

import useMarketBasketData from './../useMarketBasketData'

const MarketBasketDetail = () => {
  const { marketBasketId } = useParams()
  const { marketBaskets, loading } = useMarketBasketData()
  if (loading) return <Spinner />
  const { name, products } = marketBaskets.find(({ id }) => id === marketBasketId)
  const uniqRegs = _.uniqBy(products.reduce((acc, { regimens }) => [...acc, ...regimens], []), 'id')

  return (
    <div>
      <Link to="/orion/configuration/market-baskets/">Back</Link>
      <h1>{name}</h1>
      <h2>Products</h2>
      <ul>
        {
          products.map(({ id, generic_name, brand_name }) => (
            <li key={id}>{brand_name ? `${generic_name} (${brand_name})` : generic_name}</li>
          ))
        }
      </ul>
      <h2>Products' Unique Regimens</h2>
      <ul>
        {
          uniqRegs.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default MarketBasketDetail
