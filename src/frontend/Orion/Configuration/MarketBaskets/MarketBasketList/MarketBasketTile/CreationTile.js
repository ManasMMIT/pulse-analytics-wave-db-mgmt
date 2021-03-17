import React, { useState } from 'react'

import TileForm from './TileForm'
import { TILE_STYLE } from './MarketBasketTile'

const CreationTile = () => {
  const [isCreating, setIsCreating] = useState(false)

  const content = isCreating
    ? <TileForm onCompleted={() => setIsCreating(false)} />
    : '+'

  return (
    <div style={{ ...TILE_STYLE, background: 'none', border: `4px dotted ${TILE_STYLE.background}` }} onClick={() => setIsCreating(true)}>
      {content}
    </div>
  )
}

export default CreationTile
