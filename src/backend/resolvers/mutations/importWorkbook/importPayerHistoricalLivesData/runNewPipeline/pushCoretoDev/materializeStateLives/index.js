const materializeBreakdown = require('./materializeBreakdown')
const materializeTotals = require('./materializeTotals')

const materializeStateLives = async ({
  territoryType,
  source,
  latestData,
  pulseDevDb,
  session,
}) => {
  const livesTotalsByStateBookCoverage = await materializeTotals({
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
    livesTotalsByStateBookCoverage,
    pulseDevDb,
    session,
  })

  console.log(`Replaced ${source} ${territoryType} data in payerLatestLives`)
}

module.exports = materializeStateLives
