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
  toolIdMatchArray = [],
) => [
  {
    '$match': {
      '$and': [
        {
          $or: toolIdMatchArray
        }, {
          'connections': {
            '$exists': true
          }
        }, {
          'connections': {
            '$elemMatch': {
              'org._id': accountId
            }
          }
        }
      ]
    }
  }, {
    '$unwind': {
      'path': '$connections',
      'preserveNullAndEmptyArrays': false
    }
  }, {
    '$match': {
      'connections.org._id': accountId
    }
  }
]

const filterQuery = async (parent, {
  input: { orgTypes, selectedAccount }
}, { pulseCoreDb }, info) => {
  const toolIdMatchArray = orgTypes.map(type => {
    const toolId = TYPE_TOOL_ID_MAP[type]

    return { toolIds: toolId }
  })

  const selectedAccountId = ObjectId(selectedAccount)

  const shouldFilterAccountsOnly = orgTypes.length && !selectedAccount
  const shouldFilterConnections = orgTypes.length && selectedAccount

  let result = []
  if (shouldFilterAccountsOnly) {
    result = await pulseCoreDb.collection('organizations')
      .find({ $or: toolIdMatchArray })
      .toArray()
  } else if (shouldFilterConnections) {
    const aggPipeline = getConnectionsAggPipeline(selectedAccountId, toolIdMatchArray)

    result = await pulseCoreDb.collection('organizations')
      .aggregate(aggPipeline)
      .toArray()

    const dataGroupedByAccountId = _.groupBy(result, '_id')

    result = Object.keys(dataGroupedByAccountId).map(accountId => {
      const flatAccountData = dataGroupedByAccountId[accountId]

      const connections = flatAccountData.reduce((acc, { connections }) => {
        if (connections) {
          acc.push(connections)
        }

        return acc
      }, [])

      return ({
        ...flatAccountData[0],
        connections,
      })
    })
  }

  return _.sortBy(result, 'slug')
}

module.exports = filterQuery
