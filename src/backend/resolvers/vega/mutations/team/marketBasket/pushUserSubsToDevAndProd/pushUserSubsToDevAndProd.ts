import getUserTeamMapAggPip from './utils/getUserTeamMapAggPip'
import getVegaTeamsSubscriptionMap from './utils/getVegaTeamsSubscriptionMap'
import getUniqueMarketBasketSubIds from './utils/getUniqueMarketBasketSubIds'
import catchNoUserOps from './utils/catchNoUserOps'

const pushUserSubsToDevAndProd = async (
  parent,
  { input: { clientTeamId } },
  { pulseCoreDb, pulseDevDb, pulseProdDb },
  info
) => {
  const { userTeamsMap } = await pulseCoreDb.collection('roles')
    .aggregate(getUserTeamMapAggPip(clientTeamId))
    .next()

  catchNoUserOps(userTeamsMap)

  const teamsSubscriptionsMap = await getVegaTeamsSubscriptionMap(userTeamsMap)

  const usersDevProdSubOps = Object.entries(userTeamsMap)
    .map(([userId, teamUuids]) => {
      const uniqueMarketBasketSubIds = getUniqueMarketBasketSubIds(teamUuids, teamsSubscriptionsMap)

      const findObj = { _id: userId }
      const setObj = { $set: { marketBasketSubscriptions: uniqueMarketBasketSubIds } }
      const userDevSubOp = pulseDevDb.collection('users').updateOne(findObj, setObj)
      const userProdSubOp = pulseProdDb.collection('users').updateOne(findObj, setObj)

      return Promise.all([userDevSubOp, userProdSubOp])
    })

  await Promise.all(usersDevProdSubOps)

  return 'success'
}

export default pushUserSubsToDevAndProd



