const d3 = require('d3-collection')
const _ = require('lodash')

const materializeTotals = async ({
  territoryType,
  source,
  latestData,
  pulseDevDb,
  session,
}) => {
  const livesTotalsByStateBookCoverage = d3
    .nest()
    .key((row) => row.territoryName)
    .key((row) => row.book)
    .key((row) => row.coverage)
    .rollup((arr) => arr.reduce((acc, { lives }) => acc + lives, 0))
    .object(latestData)

  const livesTotalsForStateBookCoverage = _.reduce(
    livesTotalsByStateBookCoverage,
    (acc, bookObj, territoryName) => {
      _.forEach(bookObj, (coverageObj, book) => {
        _.forEach(coverageObj, (lives, coverage) => {
          acc.push({
            lives,
            source,
            territoryType,
            territoryName,
            book,
            coverage,
          })
        })
      })

      return acc
    },
    []
  )

  await pulseDevDb
    .collection('payerLatestLives.totals')
    .deleteMany({ source, territoryType }, { session })

  await pulseDevDb
    .collection('payerLatestLives.totals')
    .insertMany(livesTotalsForStateBookCoverage, { session })

  return livesTotalsByStateBookCoverage
}

module.exports = materializeTotals
