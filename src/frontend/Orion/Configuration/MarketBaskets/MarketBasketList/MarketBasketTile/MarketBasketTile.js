import React, { useState } from 'react'
import TileForm from './TileForm'

export const TILE_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 12,
  margin: 12,
  height: 150,
  width: 150,
  background: '#eef4fa',
  borderRadius: 4,
}

const MarketBasketTile = ({ data }) => {
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
        <div style={{ fontSize: 11 }}>({indName})</div>
      </>
    )

  return (
    <div onDoubleClick={() => setIsUpdating(!isUpdating)} style={TILE_STYLE}>
      {content}
    </div>
  )
}

export default MarketBasketTile
