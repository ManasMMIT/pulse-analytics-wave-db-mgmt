const _ = require('lodash')

const getProblemRowsByType = require('./getProblemRowsByType')

const getErrorObj = async (rawJson, core) => {
  const problemRows = await getProblemRowsByType(rawJson, core)

  return Object.keys(problemRows).map(field => ({
    type: field,
    message: `${ _.capitalize(field) } validation failed`,
    problemRows: problemRows[field],
  }))
}

module.exports = getErrorObj