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
}, { pulseRawDb, pulseCoreDb }, info) => {
  const selectedAccountId = ObjectId(selectedAccount)
  const shouldFilterAccountsOnly = orgTypes.length && !selectedAccount
  const shouldFilterConnections = orgTypes.length && selectedAccount

  let result = []
  if (shouldFilterAccountsOnly) {
    result = await pulseRawDb.collection('queryTool.phase2')
      .find({ type: { $in: orgTypes } })
      .toArray()
  } else if (shouldFilterConnections) {
    const aggPipeline = getConnectionsAggPipeline(selectedAccountId, orgTypes)

    result = await pulseRawDb.collection('queryTool.phase2')
      .aggregate(aggPipeline)
      .toArray()

    const isDataFlatByState = result
      .some(datum => datum.connections && datum.connections.state)

    if (isDataFlatByState) {
      const dataGroupedByAccountId = _.groupBy(result, '_id')

      result = Object.keys(dataGroupedByAccountId).map(accountId => {
        const flatAccountData = dataGroupedByAccountId[accountId]
        const states = flatAccountData.reduce((acc, { connections: { state } }) => {
          if (state) acc.push(state)

          return acc
        }, [])

        return ({
          ...flatAccountData[0],
          states,
        })
      })
    }
  }

  return _.sortBy(result, 'slug')
}

module.exports = filterQuery
