import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Button, Tag } from '@pulse-analytics/pulse-design-system'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import PushMarketBasketsToDevButton from '../PushMarketBasketsToDevButton'

const TitleSection = styled.div({
  display: 'flex',
  padding: '24px 12px 0px',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const MarketBasketDetailHeader = ({ name }) => {
  return (
    <TitleSection>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/orion/specialized/value-perception/market-baskets">
          <Button
            type="secondary"
            style={{
              fontFamily: 'inherit',
              margin: 12,
              padding: '0 6px',
            }}
          >
            <Icon
              iconName="arrow-drop-left"
              color1={Color.PRIMARY}
              width={16}
            />
            All Market Baskets
          </Button>
        </Link>
        <h2 style={{ padding: '0 12px' }}>{name}</h2>
        <Tag
          color={Color.GRAY_DARK}
          style={{
            border: 'none',
            background: transparentize(0.85, Color.GRAY_DARK),
            padding: '2px 8px',
            textTransform: 'none',
          }}
        >
          Market Basket
        </Tag>
        <PushMarketBasketsToDevButton />
      </div>
      <Button
        color={Color.GRAY_DARK}
        style={{
          background: transparentize(0.85, Color.GRAY_DARK),
          padding: '4px 6px',
        }}
        type="ghost"
      >
        Help/Guide
      </Button>
    </TitleSection>
  )
}

export default MarketBasketDetailHeader
