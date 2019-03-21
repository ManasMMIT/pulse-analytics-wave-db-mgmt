const _ = require('lodash')
require('dotenv').load()

function sanitizeKeysAndTrimData(obj) {
  const newObj = {}

  Object.keys(obj).forEach(item => {
    newObj[_.camelCase(item.trim())] = typeof obj[item] === 'string'
      ? obj[item].trim()
      : obj[item]
  })

  return newObj
}

function isEmptyRow(obj) {
  for (const key in obj) {
    if (obj[key] != "") return false;
  }
  return true;
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

module.exports = {
  sanitizeKeysAndTrimData,
  isEmptyRow,
  getScriptTerminator,
  verifyCollectionExists
}
