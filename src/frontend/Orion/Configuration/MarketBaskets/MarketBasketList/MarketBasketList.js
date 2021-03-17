import React from 'react'

import Spinner from 'frontend/components/Spinner'
import useMarketBasketData from '../useMarketBasketData'

import MarketBasketTile from './MarketBasketTile'
import CreationTile from './MarketBasketTile/CreationTile'

const MarketBasketList = () => {
  const { marketBaskets, loading } = useMarketBasketData()

  if (loading) return <Spinner />

  let marketBasketList = marketBaskets.map(marketBasket => <MarketBasketTile key={marketBasket.id} data={marketBasket} />)
  marketBasketList.push(<CreationTile key="market-basket-creation-tile" />)

  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, padding: 12, margin: 12 }}>Market Baskets</div>
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', height: 200 }}>
        {marketBasketList}
      </div>
    </div>
  )
}

export default MarketBasketList
