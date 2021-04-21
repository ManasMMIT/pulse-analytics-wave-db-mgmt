import React, { useState } from 'react'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import Card from 'frontend/components/Card'

import StatListItem from '../StatListItem'
import MarketBasketDetailModal from './MarketBasketDetailModal'

const Header = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
})

const MarketBasketDetailCard = ({ name, marketBasket }) => {
  const [isModalOpen, setModal] = useState(false)
  const { indication, description } = marketBasket

  return (
    <div style={{ width: '50%' }}>
      <Card bodyStyle={{ padding: 12 }}>
        <Header>
          <h4>Market Basket Details</h4>
          <Button
            onClick={() => setModal(true)}
            type="secondary"
            style={{
              fontFamily: 'inherit',
              padding: '4px 6px',
            }}
          >
            Edit Market Basket Details
          </Button>
        </Header>
        <StatListItem title="Market Basket Name" description={name} />
        <StatListItem title="Indication" description={indication.name} />
        <StatListItem title="Description" description={description} />
      </Card>
      <MarketBasketDetailModal
        isModalOpen={isModalOpen}
        closeModal={() => setModal(false)}
        name={name}
        marketBasket={marketBasket}
      />
    </div>
  )
}

export default MarketBasketDetailCard
