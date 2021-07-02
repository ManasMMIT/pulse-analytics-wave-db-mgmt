import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router'

import {
  GET_MARKET_BASKETS,
  GET_MARKET_BASKETS_SUBSCRIPTIONS,
} from 'frontend/api/queries'

import {
  SUBSCRIBE_TEAM_TO_MARKET_BASKET,
  UNSUBSCRIBE_TEAM_TO_MARKET_BASKET,
} from 'frontend/api/mutations'

import OrionSwitch from 'frontend/Orion/shared/OrionSwitch'
import Spinner from 'frontend/components/Spinner'
import PushToProductionButton from './PushToProductionButton'

import handleToggle from './utils/handleToggle'
import getMarketBasketsWithSubscriptionStatuses from './utils/getMarketBasketsWithSubscriptionStatuses'

const MarketBasketSubscription = () => {
  const { clientTeamId } = useParams()

  const { data: marketBasketData, loading: mbsLoading } = useQuery(
    GET_MARKET_BASKETS
  )

  const { data: marketBasketSubData, loading: subsLoading } = useQuery(
    GET_MARKET_BASKETS_SUBSCRIPTIONS,
    {
      variables: { clientTeamId },
    }
  )

  let subscriptions = []
  if (!subsLoading)
    subscriptions = marketBasketSubData.marketBasketsSubscriptions

  const [subscribeToMarketBasket, { loading: isSubbing }] = useMutation(
    SUBSCRIBE_TEAM_TO_MARKET_BASKET,
    {
      update: (cache, { data }) => {
        const newSubs = [...subscriptions, Object.values(data)[0]]

        cache.writeQuery({
          query: GET_MARKET_BASKETS_SUBSCRIPTIONS,
          data: { marketBasketsSubscriptions: newSubs },
          variables: { clientTeamId },
        })
      },
      onError: alert,
    }
  )

  const [unsubscribeToMarketBasket, { loading: isUnsubbing }] = useMutation(
    UNSUBSCRIBE_TEAM_TO_MARKET_BASKET,
    {
      update: (cache, { data }) => {
        const newSubs = subscriptions.filter(
          ({ market_basket }) =>
            market_basket !== Object.values(data)[0].market_basket
        )

        cache.writeQuery({
          query: GET_MARKET_BASKETS_SUBSCRIPTIONS,
          data: { marketBasketsSubscriptions: newSubs },
          variables: { clientTeamId },
        })
      },
      onError: alert,
    }
  )

  const shouldNotRender = mbsLoading || subsLoading

  if (shouldNotRender) return <Spinner />

  const { marketBaskets } = marketBasketData || {}

  const marketBasketSubscriptionStatuses = getMarketBasketsWithSubscriptionStatuses(
    marketBaskets,
    subscriptions
  )

  return (
    <div style={{ padding: 12, margin: 12 }}>
      <div>
        <h2 style={{ paddingBottom: 6 }}>Market Baskets</h2>
        <span style={{ paddingLeft: 12 }}>
          <PushToProductionButton />
        </span>
      </div>
      {marketBasketSubscriptionStatuses.map((subscription) => {
        return (
          <div key={subscription.id}>
            <OrionSwitch
              isDisabled={isSubbing || isUnsubbing}
              handleToggle={(e) =>
                handleToggle(e, {
                  subscriptions,
                  subscribeToMarketBasket,
                  unsubscribeToMarketBasket,
                  clientTeamId,
                })
              }
              isChecked={subscription.isSubscribed}
              value={subscription.id}
            />
            <span>{subscription.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default MarketBasketSubscription
