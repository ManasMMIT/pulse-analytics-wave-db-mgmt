import axios from 'axios'
import _ from 'lodash'

const getVegaTeamsSubscriptionMap = async (userTeamsMap: { key: any }) => {
  const flatUserTeams = Object.values(userTeamsMap)
    .reduce((acc, uuidArray) => [...acc, ...uuidArray], [])

  const uniqTeams = _.uniq(flatUserTeams).join(',')

  const marketBasketSubscriptions = await axios.get(`market-basket-subscriptions/?team__in=${uniqTeams || ''}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return _.groupBy(marketBasketSubscriptions, 'team')
}

export default getVegaTeamsSubscriptionMap
