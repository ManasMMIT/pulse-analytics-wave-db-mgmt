import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Spinner from 'frontend/components/Spinner'
import TileForm from './TileForm'

export const TILE_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: 12,
  margin: 12,
  height: 150,
  width: 150,
  background: '#eef4fa',
  borderRadius: 4,
}

const MarketBasketTile = ({ data, isHydrating }) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    name,
    indication: { name: indName },
  } = data

  const content = isUpdating
    ? <TileForm data={{ id: data.id, name, indication: data.indication.uuid }} onCompleted={() => setIsUpdating(false)} />
    : (
      <>
        <div>{name}</div>
        <div style={{ fontSize: 11 }}>({isHydrating ? <Spinner /> : indName})</div>
      </>
    )

  return (
    <div style={TILE_STYLE}>
      <div onDoubleClick={() => setIsUpdating(!isUpdating)}>
        {content}
      </div>
      <Link style={{ alignSelf: 'flex-end' }} to={`/orion/configuration/market-baskets/${data.id}`}>
        detail
      </Link>
    </div>
  )
}

export default MarketBasketTile
