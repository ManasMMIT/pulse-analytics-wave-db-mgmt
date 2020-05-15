const _ = require('lodash')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../utils/defaultTimeZone')

const getChildNodes = require('../team/utils/cascadeUpdateResources/getChildNodes')

// ! This resolver will update a node and all of its children's 'tdgTimestamp` slice
// ! FOR ALL ROLES AND USERS IN ONE TRANSACTION. If the intention at any point is to
// ! have diff timestamps depending on the role, then this isn't the right tool for the job.
const updateTdgTimestamps = async (
  parent,
  { input: { _id, tdgTimestamp } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  tdgTimestamp = zonedTimeToUtc(tdgTimestamp, DEFAULT_TIMEZONE)

  let targetNodeIds

  const session = mongoClient.startSession()
  
  await session.withTransaction(async () => {
    // STEP 1: Get the node and all of its children
    const nodes = await pulseCoreDb.collection('nodes')
      .find({}, { session })
      .toArray()

    const nodesByParentId = _.groupBy(nodes, 'parentId')
    
    const childNodeIds = getChildNodes(_id, nodesByParentId)
      .map(({ _id: nodeId }) => nodeId)

    targetNodeIds = [_id, ...childNodeIds]

    // STEP 2: Update all of those nodes' tdgTimestamps
    // ! Need this step so when any team toggles on a node in phoenix, 
    // ! it'll have the correct timestamp already
    const updateCoreNodesOp = pulseCoreDb.collection('nodes')
      .updateMany(
        { _id: { $in: targetNodeIds } },
        { 
          $set: {
            'text.tdgTimestamp': tdgTimestamp
          }
        },
        { session },
      )

    // STEP 3: Update all roles' nodes that belong to targetNodeIds
    const updateCoreRolesOp = pulseCoreDb.collection('roles')
      .updateMany(
        {},
        {
          $set: {
            'sitemap.tools.$[node].text.tdgTimestamp': tdgTimestamp,
            'sitemap.dashboards.$[node].text.tdgTimestamp': tdgTimestamp,
            'sitemap.pages.$[node].text.tdgTimestamp': tdgTimestamp,
            'sitemap.cards.$[node].text.tdgTimestamp': tdgTimestamp,
          },
        },
        { 
          session,
          arrayFilters: [
            {
              'node._id': { $in: targetNodeIds },
            }
          ],
        },
      )

    // STEP 4: Update all users' nodes that belong to targetNodeIds
    const updateDevUsersSitemapsOps = ['tools', 'dashboards', 'pages', 'cards'].map(nodeType => (
      pulseDevDb.collection('users.sitemaps')
        .updateMany(
          {
            [`sitemap.${nodeType}`]: { $type: 'array' } // slice must exist for op not to break
          },
          {
            $set: {
              [`sitemap.${nodeType}.$[node].text.tdgTimestamp`]: tdgTimestamp
            }
          },
          {
            session,
            arrayFilters: [
              {
                'node._id': { $in: targetNodeIds },
              }
            ],
          },
        )
    ))

    await Promise.all([
      updateCoreNodesOp,
      updateCoreRolesOp,
      ...updateDevUsersSitemapsOps,
    ])
  })

  return {
    entryNode: _id,
    updatedNodes: targetNodeIds,
    tdgTimestamp,
  }
}

module.exports = updateTdgTimestamps
