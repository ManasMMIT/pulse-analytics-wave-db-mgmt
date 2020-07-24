const materializeBreakdown = require('./materializeBreakdown')
const materializeTotals = require('./materializeTotals')

const materializeNationalLives = async ({
  territoryType,
  source,
  latestData,
  pulseDevDb,
  session,
}) => {
  const livesTotalsByBookCoverage = await materializeTotals({
    territoryType,
    source,
    latestData,
    pulseDevDb,
    session,
  })

  console.log(
    `Replaced ${source} ${territoryType} data in pulse-dev.payerLatestLives.totals`
  )

  await materializeBreakdown({
    territoryType,
    source,
    latestData,
    livesTotalsByBookCoverage,
    pulseDevDb,
    session,
  })

  console.log(
    `Replaced ${source} ${territoryType} data in pulse-dev.payerLatestLives`
  )
}

module.exports = materializeNationalLives
