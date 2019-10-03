const _ = require('lodash')
const authClient = require('../src/backend/auth0/authClient')

const updateTeamPermissions = async ({ pulseDevDb, mongoConnection }) => {
  console.log('Beginning to fetch team permissions...')
  const [
    allPermissionObjs,
    auth0Teams,
    groups,
    clientTeams,
  ] = await Promise.all([
    authClient.getPermissions(),
    authClient.getRoles(),
    authClient.getGroups(),
    pulseDevDb
      .collection('temp.teams')
      .find()
      .toArray(),
  ])

  const permissionsById = _.keyBy(allPermissionObjs, '_id')
  const groupsById = _.keyBy(groups, '_id')
  const auth0TeamsById = _.keyBy(auth0Teams, '_id')

  const teamPermissions = clientTeams.reduce((acc, team) => {
    const { _id } = team

    const roleObj = groupsById[_id]
    if (!roleObj || !roleObj.roles) return acc
    const roleId = roleObj.roles[0]

    const { permissions } = auth0TeamsById[roleId]

    const permissionStrings = permissions.reduce((acc, id) => {
      const permissionObj = permissionsById[id]
      if (Boolean(permissionObj)) {
        const [read, tool, permission, ...rest] = permissionObj.description.split(':')
        // note: we are currently only accounting for pathways permissions
        if (tool === 'pathways') {
          if (permission === 'account') {
            const account = rest[0]
            if (!acc[permission].includes(account)) {
              acc[permission].push(account)
            }
          } else if (permission === 'ind') {
            // 'ind' is actually the equivalent of a treatment plan in auth0
            const [indication, regimen] = rest
            if (indication === 'Breast') return acc

            const isIndicationAccountedFor = Boolean(acc['treatmentPlan'][indication])

            if (isIndicationAccountedFor) {
              if (!acc['treatmentPlan'][indication].includes(regimen)) {
                acc['treatmentPlan'][indication].push(regimen)
              }
            } else {
              acc['treatmentPlan'][indication] = [regimen]
            }
          }
        }
      }

        return acc
    }, { account: [], treatmentPlan: {} })

    const filteredPermissions = Object.entries(permissionStrings).reduce((acc, item) => {
      const [permissionKey, permissionValue] = item 
      if (!_.isEmpty(permissionValue)) {
        acc[permissionKey] = permissionValue
      }
      return acc
    }, {})

    acc.push({ _id, permissions: filteredPermissions })
    return acc
  }, [])
  
  const session = mongoConnection.startSession()

  try {
    await session.withTransaction(async () => {
      for (const team of teamPermissions) {
        const { _id, permissions } = team
        if (!_.isEmpty(permissions)){
          await pulseDevDb
            .collection('temp.teams')
            .findOneAndUpdate(
            { _id },
            { $set: { 'resources.pathwaysPermissions': permissions}},
            { session }
          )
        }
      }
    })

    console.log('Permissions have been updated for pathways teams on "temp.teams" collection')
    console.log('-------- step 2 completed --------')
  } catch(e) {
    console.log(e)
    console.log('Failed to update permissions for pathways teams on "temp.teams"')
  }
}

module.exports = updateTeamPermissions
