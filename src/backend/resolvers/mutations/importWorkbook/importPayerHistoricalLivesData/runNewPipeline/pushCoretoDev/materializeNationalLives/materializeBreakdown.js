const materializeBreakdown = async ({
  territoryType,
  source,
  latestData,
  livesTotalsByBookCoverage,
  pulseDevDb,
  session,
}) => {
  const latestDataWithLives = latestData.map((doc) => {
    const { book, coverage } = doc
    let livesPercent = doc.lives / livesTotalsByBookCoverage[book][coverage]
    // ! just in case the denominator is zero, meaning livesPercent would be NaN
    if (!livesPercent) livesPercent = 0

    return { ...doc, livesPercent }
  })

  await pulseDevDb
    .collection('payerLatestLives')
    .deleteMany({ source, territoryType }, { session })

  await pulseDevDb
    .collection('payerLatestLives')
    .insertMany(latestDataWithLives, { session })
}

module.exports = materializeBreakdown
