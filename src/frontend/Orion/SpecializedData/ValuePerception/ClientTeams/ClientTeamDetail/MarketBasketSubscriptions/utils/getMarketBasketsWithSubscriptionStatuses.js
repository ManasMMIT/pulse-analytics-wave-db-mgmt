import _ from 'lodash'

const getMarketBasketsWithSubscriptionStatuses = (
  marketBaskets,
  marketBasketSubscriptions
) => {
  const marketBasketSubscriptionsMap = _.keyBy(
    marketBasketSubscriptions,
    'market_basket'
  )

  return marketBaskets.map((marketBasket) => {
    const isSubscribed = Boolean(marketBasketSubscriptionsMap[marketBasket.id])

    return { ...marketBasket, isSubscribed }
  })
}

export default getMarketBasketsWithSubscriptionStatuses
