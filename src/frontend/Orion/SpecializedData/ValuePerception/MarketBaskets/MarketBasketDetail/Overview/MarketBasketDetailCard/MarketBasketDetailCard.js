import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import Card from 'frontend/components/Card'
import Spacing from 'frontend/utils/spacing'

import StatListItem from '../StatListItem'
import MarketBasketDetailModal from './MarketBasketDetailModal'

const Header = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.S4,
})

const MarketBasketDetailCard = ({ name, marketBasket }) => {
  const [isModalOpen, setModal] = useState(false)
  const { indication, description } = marketBasket

  return (
    <div style={{ width: '50%' }}>
      <Card bodyStyle={{ padding: Spacing.S4 }}>
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
      {isModalOpen && (
        <MarketBasketDetailModal
          closeModal={() => setModal(false)}
          name={name}
          marketBasket={marketBasket}
        />
      )}
    </div>
  )
}

MarketBasketDetailCard.propTypes = {
  name: PropTypes.string.isRequired,
  marketBasket: PropTypes.object.isRequired,
}

export default MarketBasketDetailCard
