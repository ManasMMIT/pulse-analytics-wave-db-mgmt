const _ = require('lodash')

function sanitizeKeysAndTrimData(obj) {
  const result = _.reduce(obj, (acc, value, key) => {
    const trimmedKey = key.trim() // in case the key has weird zero width unicode chars
    if (!trimmedKey || value === '') return acc

    acc[_.camelCase(trimmedKey)] = typeof value === 'string' ? value.trim() : value
    return acc
  }, {})

  return result
}

function isEmptyRow(obj) {
  for (const key in obj) {
    if (obj[key] !== "") return false
  }

  return true
}

const getScriptTerminator = mongoConnection => async (...errMessages) => {
  if (_.compact(errMessages).length > 0) console.error(...errMessages)
  await mongoConnection.close()
  process.exit()
}

const verifyCollectionExists = async (collectionName, db, mongoConnection) => {
  const terminateScript = getScriptTerminator(mongoConnection)

  const numOfCollections = await db.listCollections({ name: collectionName }).toArray()
    .catch(async err => {
      await terminateScript('Error checking if collection exists', err)
    })

  if (numOfCollections.length === 0) {
    await terminateScript(`Collection '${collectionName}' does not exist. Data could not be updated.`)
  }
}

const latestMonthYearPipeline = [
  {
    $group: {
      _id: {
        year: '$year',
        month: '$month',
      },
      data: { $push: '$$ROOT' }
    }
  },
  {
    $sort: {
      '_id.year': -1,
      '_id.month': -1
    }
  },
  {
    $limit: 1
  },
  {
    $unwind: '$data'
  },
  {
    $replaceRoot: { newRoot: '$data' }
  }
]

module.exports = {
  sanitizeKeysAndTrimData,
  isEmptyRow,
  getScriptTerminator,
  verifyCollectionExists,
  latestMonthYearPipeline
}
