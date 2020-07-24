const d3 = require('d3-collection')
const _ = require('lodash')

const materializeTotals = async ({
  territoryType,
  source,
  latestData,
  pulseDevDb,
  session,
}) => {
  const livesTotalsByBookCoverage = d3
    .nest()
    .key((row) => row.book)
    .key((row) => row.coverage)
    .rollup((arr) => arr.reduce((acc, { lives }) => acc + lives, 0))
    .object(latestData)

  const livesTotals = _.reduce(
    livesTotalsByBookCoverage,
    (acc, coverageObj, book) => {
      _.forEach(coverageObj, (lives, coverage) => {
        acc.push({
          lives,
          source,
          territoryType,
          territoryName: 'United States',
          book,
          coverage,
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
    .insertMany(livesTotals, { session })

  return livesTotalsByBookCoverage
}

module.exports = materializeTotals
