const _ = require('lodash')

const filterTeamAlertsByPermissions = async ({ pulseDevDb, mongoConnection }) => {
  console.log('Creating pathways teams alerts via their permissions...')

  const alerts = await pulseDevDb.collection('alerts').find().toArray()
  const alertsGroupedBySuperAlertType = _.groupBy(alerts, 'superAlertType')

  const teamPermissions = await pulseDevDb
    .collection('temp.teams')
    .find({ 'resources.pathwaysPermissions': { $exists: true }})
    .toArray()

  const alertsByTeam = teamPermissions.map(team => {
    const { account, treatmentPlan } = team.resources.pathwaysPermissions
    const accountSet = new Set(account)

    treatmentPlan['General'] = {} // to allow all 'General' indications in
    treatmentPlan['N/A'] = {} // to allow all 'N/A' indications in

    const teamAlerts = Object.values(alertsGroupedBySuperAlertType).map(arr => {
      const { permission } = arr[0]
      
      let result = [...arr]
      if (permission.includes('account')){
        result = result.filter(({ slug }) => accountSet.has(slug))
      }

      if (permission.includes('indication')){
        result = result.filter(({ indication, member }) => {
          if (!Boolean(indication)) return false
          if (member){
            return indication.some(item => treatmentPlan[item])
          } else {
            return treatmentPlan[indication]
          }
        })

        if (permission.includes('regimen')){
          result = result.filter(({ regimen, indication }) => treatmentPlan[indication].includes(regimen))
        }
      }

      return result
    })

    return { _id: team._id, alerts: _.flatten(teamAlerts) }
  })
  
  const session = mongoConnection.startSession()

  try {
    await session.withTransaction(async () => {
      for (const team of alertsByTeam) {
        const { _id, alerts } = team
        await pulseDevDb
          .collection('temp.teams')
          .findOneAndUpdate(
            { _id },
            { $set: { 'resources.pathwaysAlerts': alerts }},
            { session }
          )
      }
    })

    console.log('Alerts have been updated for pathways teams on "temp.teams" collection')
    console.log('-------- step 3 completed --------')
  } catch(e) {
    console.log(e)
    console.log('Failed to update alerts for pathways teams on "temp.teams"')
  }
}

module.exports = filterTeamAlertsByPermissions
