import React from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import queryString from 'query-string'
import { transparentize } from 'polished'

import { UnderlinedTabs } from '@pulse-analytics/pulse-design-system'
import Spinner from 'frontend/components/Spinner'
import Color from 'frontend/utils/color'

import { GET_VEGA_CLIENT_TEAMS } from 'frontend/api/queries'

import ClientTeamDetailHeader from './ClientTeamDetailHeader'
import MarketBasketSubscription from './MarketBasketSubscriptions'

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
  { label: 'Market Basket Subscriptions', value: 'subscription' },
  { label: 'Regions', value: 'regions' },
]

const COMPONENT_MAP = {
  subscription: MarketBasketSubscription,
  regions: () => null,
}

const ClientTeamDetail = () => {
  const { clientTeamId } = useParams()
  const location = useLocation()
  const history = useHistory()

  const parsedSearch = queryString.parse(location.search)
  const selectedTab = parsedSearch && parsedSearch.tab ? parsedSearch.tab : null

  const setTab = (tab) => {
    history.push({
      search: queryString.stringify({ tab }),
    })
  }

  const { data, loading } = useQuery(GET_VEGA_CLIENT_TEAMS, {
    variables: { clientTeamId },
  })

  if (!selectedTab) {
    setTab(TABS_DATA[0].value)
  }

  if (loading || !selectedTab) return <Spinner />
  const [vegaClientTeam] = data.vegaClientTeams || []

  if (!vegaClientTeam) return <Spinner />

  const {
    name: teamName,
    client: { name: clientName },
  } = vegaClientTeam

  const headerLabel = `${clientName} / ${teamName}`

  const Component = COMPONENT_MAP[selectedTab]

  return (
    <Wrapper>
      <section>
        <ClientTeamDetailHeader name={headerLabel} />
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
        <Component vegaClientTeam={vegaClientTeam} />
      </Body>
    </Wrapper>
  )
}

export default ClientTeamDetail
