const connectToMongoDb = require('../connect-to-mongodb')
// const _ = require('lodash')

const upsertUsersPermissions = require('./../src/backend/resolvers/mutations/sitemap/permissions-upsertion/upsertUsersPermissions')

const {
  STATE_ID_BY_ABBREV,
  STATE_LONG_BY_ABBREV,
} = require('./../importHistoricalData/states-data-util')

let regionalBreakdown = require('./regional-breakdown')

regionalBreakdown = regionalBreakdown.map(({ region, state }) => ({
  id: STATE_ID_BY_ABBREV[state],
  region,
  state,
  stateLong: STATE_LONG_BY_ABBREV[state],
  updatedAt: new Date(),
  createdAt: new Date(),
}))

const PAYER_TOOL_ID = "a3f419de-ca7d-4498-94dd-04fb9f6b8777"

const REGIONAL_TARGETING_PAGE_ID = "4e6304a5-4847-474f-a8f8-9cbeb8a77677"

const ROLE_ID = "ec8e8e74-4148-4b6b-bf6c-f2532cd28368" // role named 'Payer Tool' under Immunomedics client

const run = async () => {
  const dbs = await connectToMongoDb()
  const session = dbs.startSession()

  await session.withTransaction(async () => {
    const pulseCoreDb = dbs.db('pulse-core')
    const pulseDevDb = dbs.db('pulse-dev')

    const coreRoles = pulseCoreDb.collection('roles')

    // 1. insert regional breakdown onto team's payer tool and regional targeting page nodes
    const { value: updatedRole } = await coreRoles.findOneAndUpdate(
      { _id: ROLE_ID },
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

  console.log('Hotfix regional breakdown finished')

  dbs.close()
}

run()
