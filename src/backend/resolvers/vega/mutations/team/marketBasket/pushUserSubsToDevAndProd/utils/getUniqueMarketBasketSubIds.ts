import _ from 'lodash'

const getUniqueMarketBasketSubIds = (teamUuids: any, teamSubscriptionsMap: _.Dictionary<any[]>) => {
  const marketBasketSubIds = teamUuids.reduce((acc, teamUuid) => {
    const teamSubscriptions = teamSubscriptionsMap[teamUuid] || []

    return [...acc, ...teamSubscriptions.map(({ market_basket }) => market_basket)]
  }, [])

  const uniqueMarketBasketSubIds = _.uniq(marketBasketSubIds)
  return uniqueMarketBasketSubIds
}

export default getUniqueMarketBasketSubIds
