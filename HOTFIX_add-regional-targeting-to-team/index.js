const connectToMongoDb = require('../connect-to-mongodb')
// const _ = require('lodash')

const upsertUsersPermissions = require('./../src/backend/resolvers/mutations/sitemap/permissions-upsertion/upsertUsersPermissions')

const {
  STATE_ID_BY_ABBREV,
  STATE_LONG_BY_ABBREV,
} = require('./../importHistoricalData/states-data-util')

let regionalBreakdown = require('./regional-breakdown')

regionalBreakdown = regionalBreakdown.map(({ region, state }) => {
  const trimmedState = state.trim()
  const trimmedRegion = region.trim()
  
  return {
    id: STATE_ID_BY_ABBREV[trimmedState],
    region: trimmedRegion,
    state: trimmedState,
    stateLong: STATE_LONG_BY_ABBREV[trimmedState],
    updatedAt: new Date(),
    createdAt: new Date(),
  }
})

const PAYER_TOOL_ID = "a3f419de-ca7d-4498-94dd-04fb9f6b8777"

const REGIONAL_TARGETING_PAGE_ID = "4e6304a5-4847-474f-a8f8-9cbeb8a77677"

// const CLIENT_ID = '4f39459f-4633-4c73-aece-c087b938dadc' // client regeneron/sanofi

const updateSingleCoreRoleAndDevUsersNodesResources = async ({
  dbs, 
  roleId,
  pulseCoreDb,
  pulseDevDb,
}) => {
  const session = dbs.startSession()

  await session.withTransaction(async () => {
    const coreRoles = pulseCoreDb.collection('roles')

    // 1. insert regional breakdown onto team's payer tool and regional targeting page nodes
    const { value: updatedRole } = await coreRoles.findOneAndUpdate(
      { _id: roleId },
      {
        $set: {
          'resources.$[resource].regionalBreakdown': regionalBreakdown,
        }
      },
      {
        returnOriginal: false,
        arrayFilters: [
          { 'resource.nodeId': { $in: [PAYER_TOOL_ID, REGIONAL_TARGETING_PAGE_ID] } }
        ]
      },
    )

    // 2. persist updated resources to all users
    await upsertUsersPermissions({
      users: updatedRole.users,
      pulseCoreDb,
      pulseDevDb,
      session,
    })
  })

  console.log(`Hotfix regional breakdown finished for role ${roleId}`)
}

const updateClientRegionalBreakdown = async () => {
  const dbs = await connectToMongoDb()
  const pulseCoreDb = dbs.db('pulse-core')
  const pulseDevDb = dbs.db('pulse-dev')

  // const targetRoles = await pulseCoreDb.collection('roles')
  //   .find({ 'client._id': CLIENT_ID })
  //   .toArray()

  // const roleIds = targetRoles.map(({ _id }) => _id)

  // ! Don't include role Sanofi Payer Team under client Regeneron
  const roleIds = [
    "5404d17a-d830-4e68-ba5a-623abf96ab74", // regeneron, 'Senior Management' team
    "c04bfb71-9314-4a51-be72-480c3d7c82cf", // regeneron, 'admin' team
    "0f3cb1b9-2eb5-4741-9b95-3f8efb34df4c", // regeneron, 'Regeneron Payer Team'
  ]

  for (const roleId of roleIds) {
    await updateSingleCoreRoleAndDevUsersNodesResources({
      dbs,
      pulseCoreDb,
      pulseDevDb,
      roleId,
    })
  }

  console.log('All roles\' regional breakdowns finished updating')

  dbs.close()
}

updateClientRegionalBreakdown()
