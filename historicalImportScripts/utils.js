const _ = require('lodash')
require('dotenv').load()

function sanitizeKeysAndTrimData(obj) {
  const newObj = {}
  Object.keys(obj).forEach(function(item) {
    if (obj[item] !== "") {
      // trim keys and camelCase
      newObj[_.camelCase(item.trim())] = typeof obj[item] === 'string'
        ? obj[item].trim()
        : obj[item]
    }
  })
  return newObj
}

function isEmptyRow(obj) {
  for (const key in obj) {
    if (obj[key] != "") return false;
  }
  return true;
}

const LOADER_URI = process.env.LOADER_URI

const getCollectionDoesNotExistError = name => (
  `Collection '${ name }' does not exist. Data could not be updated.
  Check csv filename and/or whether --ignoreProjects flag should be there.`
)

module.exports = {
  sanitizeKeysAndTrimData,
  isEmptyRow,
  LOADER_URI,
  getCollectionDoesNotExistError
}
