const { ObjectId } = require('mongodb')
const _ = require('lodash')

const {
  PAYER_TOOL_ID,
  PROVIDER_TOOL_ID,
  PATHWAYS_TOOL_ID,
  APM_TOOL_ID,
  // SICKLE_TOOL_ID,
  // IMMUNO_TOOL_ID,
  // MSA_TOOL_ID,
} = require('../../../global-tool-ids')

const TYPE_TOOL_ID_MAP = {
  'Payer': PAYER_TOOL_ID,
  'Provider': PROVIDER_TOOL_ID,
  'Pathways': PATHWAYS_TOOL_ID,
  'Alternative Payment Model': APM_TOOL_ID,
}

const getConnectionsAggPipeline = (
  accountId,
  toolIds = [],
) => [
    {
      '$match': {
        '_id': accountId
      }
    }, {
      '$lookup': {
        'from': 'organizations.connections',
        'localField': '_id',
        'foreignField': 'orgs',
        'as': 'connections'
      }
    }, {
      '$unwind': '$connections'
    }, {
      '$lookup': {
        'from': 'organizations',
        'localField': 'connections.orgs',
        'foreignField': '_id',
        'as': 'connections.orgs'
      }
    }, {
      '$project': {
        'slug': 1,
        'type': 1,
        'organization': 1,
        'organizationTiny': 1,
        'toolIds': 1,
        'connections': {
          '_id': 1,
          'category': 1,
          'state': 1,
          'org': {
            '$arrayElemAt': [
              {
                '$filter': {
                  'input': '$connections.orgs',
                  'cond': {
                    '$ne': [
                      '$$this._id', '$_id'
                    ]
                  }
                }
              }, 0
            ]
          }
        }
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id',
          'slug': '$slug',
          'type': '$type',
          'organization': '$organization',
          'organizationTiny': '$organizationTiny',
          'toolIds': '$toolIds'
        },
        'connections': {
          '$push': '$connections'
        }
      }
    }, {
    '$project': {
        _id: '$_id._id',
        slug: '$_id.slug',
        type: '$_id.type',
        organization: '$_id.organization',
        organizationTiny: '$_id.organizationTiny',
        toolIds: '$_id.toolIds',
        connections: {
          '$filter': {
            'input': '$connections',
            'as': 'connection',
            'cond': {
              $size: {
                $setIntersection: [
                  '$$connection.org.toolIds',
                  toolIds,
                ]
              }
            }
          }
        }
      }
    },
  ]

const filterQuery = async (parent, {
  input: { orgTypes, selectedAccount }
}, { pulseCoreDb }, info) => {
  const toolIdsArray = orgTypes.map(type => TYPE_TOOL_ID_MAP[type])

  const selectedAccountId = ObjectId(selectedAccount)

  const shouldFilterAccountsOnly = orgTypes.length && !selectedAccount
  const shouldFilterConnections = orgTypes.length && selectedAccount

  let result = []
  if (shouldFilterAccountsOnly) {
    result = await pulseCoreDb.collection('organizations')
      .find({ toolIds: { $in: toolIdsArray } })
      .toArray()
  } else if (shouldFilterConnections) {
    const aggPipeline = getConnectionsAggPipeline(selectedAccountId, toolIdsArray)

    const selectedAccountConnections = await pulseCoreDb.collection('organizations')
      .aggregate(aggPipeline)
      .toArray()

    const { connections, ...selectedAccount } = selectedAccountConnections[0]

    // ! The below code is to keep the frontend Query Tool stable for now
    // ! Once we refactor the frontend to be more dynamic, this code will have to
    // ! be changed, as well
    const connectionsGroupedByOrgId = _.groupBy(connections, 'org._id')

    result = Object.values(connectionsGroupedByOrgId)
      .map(orgConnections => {
        const connections = orgConnections.map(({ org, ...rest }) => ({
          ...rest,
          org: selectedAccount,
        }))

        return {
          ...orgConnections[0].org,
          connections,
        }
      })
  }

  return _.sortBy(result, 'slug')
}

module.exports = filterQuery
