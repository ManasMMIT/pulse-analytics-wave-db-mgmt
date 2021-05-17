import React from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import queryString from 'query-string'
import { transparentize } from 'polished'

import { UnderlinedTabs } from '@pulse-analytics/pulse-design-system'
import Spinner from 'frontend/components/Spinner'
import Color from 'frontend/utils/color'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'

import MarketBasketDetailHeader from './MarketBasketDetailHeader'
import Overview from './Overview'
import ProductsRegimens from './ProductsRegimens'
import Surveys from './Surveys'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const Body = styled.section({
  background: Color.GRAY_LIGHT,
  height: '100%',
})

const TABS_DATA = [
  { label: 'Overview', value: 'overview' },
  { label: 'Products and Regimens', value: 'product-regimens' },
  { label: 'Surveys', value: 'surveys' },
  { label: 'Client Subscriptions', value: 'client-subscriptions' },
]

const COMPONENT_MAP = {
  overview: Overview,
  'product-regimens': ProductsRegimens,
  surveys: Surveys,
}

const MarketBasketDetail = () => {
  const { marketBasketId } = useParams()
  const location = useLocation()
  const history = useHistory()

  const parsedSearch = queryString.parse(location.search)
  const selectedTab = parsedSearch && parsedSearch.tab ? parsedSearch.tab : null

  const setTab = (tab) => {
    history.push({
      search: queryString.stringify({ tab }),
    })
  }

  const { data, loading } = useQuery(GET_MARKET_BASKETS, {
    variables: { marketBasketId },
  })

  if (!selectedTab) {
    setTab(TABS_DATA[0].value)
  }

  if (loading || !selectedTab) return <Spinner />
  const [marketBasket] = data.marketBaskets || []

  // ! after deletion, market basket doesn't exist in cache before redirect
  if (!marketBasket) return <Spinner />

  const { name } = marketBasket

  const Component = COMPONENT_MAP[selectedTab]

  return (
    <Wrapper>
      <section>
        <MarketBasketDetailHeader name={name} />
        <UnderlinedTabs
          tabsData={TABS_DATA}
          onTabClick={setTab}
          selectedTab={selectedTab}
          tabsContainerStyle={{
            padding: '0 12px',
            borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
          }}
        />
      </section>
      <Body>
        <Component marketBasket={marketBasket} name={name} />
      </Body>
    </Wrapper>
  )
}

export default MarketBasketDetail
