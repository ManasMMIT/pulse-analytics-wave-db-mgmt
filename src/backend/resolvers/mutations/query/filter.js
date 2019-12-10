const { ObjectId } = require('mongodb')
const _ = require('lodash')

const getConnectionsAggPipeline = (
  accountId,
  orgTypes = [],
) => [
  {
    '$match': {
      '$and': [
        {
          'type': {
            '$in': orgTypes
          }
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
  const selectedAccountId = ObjectId(selectedAccount)
  const shouldFilterAccountsOnly = orgTypes.length && !selectedAccount
  const shouldFilterConnections = orgTypes.length && selectedAccount

  let result = []
  if (shouldFilterAccountsOnly) {
    result = await pulseCoreDb.collection('organizations')
      .find({ type: { $in: orgTypes } })
      .toArray()
  } else if (shouldFilterConnections) {
    const aggPipeline = getConnectionsAggPipeline(selectedAccountId, orgTypes)

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
