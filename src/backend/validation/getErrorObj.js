const _ = require('lodash')

const getProblemRowsByType = require('./getProblemRowsByType')

const getErrorObj = async (rawJson, core) => {
  const problemRowsByType = await getProblemRowsByType(rawJson, core)

  return Object.keys(problemRowsByType).map(field => {
    const problemRows = problemRowsByType[field]
      .map((row, idx, rows) => {
        row.sheetRows = rows.filter(o => o.value === row.value).map(l => l.sheetRow)

        delete row.sheetRow

        return row
      })

    const uniqProblemRows = _.uniqBy(problemRows, 'value')
    const uniqSortedProblemRows = _.sortBy(uniqProblemRows, ({ value }) => value.toLowerCase())

    return {
      type: field,
      message: `${ _.capitalize(field) } validation failed`,
      problemRows: uniqSortedProblemRows,
    }
  })
}

module.exports = getErrorObj