const _ = require('lodash')

const getProblemRowsByType = require('./getProblemRowsByType')

const getErrorObj = async (rawJson, core) => {
  const problemRows = await getProblemRowsByType(
    rawJson,
    core
  )

  const errorObj = Object.keys(problemRows).reduce((acc, field) => {
    const problemRowsForField = problemRows[field]

    acc[field] = ({
      message: `${ _.capitalize(field) } validation failed`,
      problemRows: problemRowsForField,
    })

    return acc
  }, {})

  return errorObj
}

module.exports = getErrorObj