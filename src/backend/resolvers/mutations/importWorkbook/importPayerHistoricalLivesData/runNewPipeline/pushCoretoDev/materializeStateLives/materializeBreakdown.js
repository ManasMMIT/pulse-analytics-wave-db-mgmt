const materializeBreakdown = async ({
  territoryType,
  source,
  latestData,
  livesTotalsByStateBookCoverage,
  pulseDevDb,
  session,
}) => {
  const latestDataWithLives = latestData.map((doc) => {
    const { book, coverage, lives, territoryName } = doc

    // Guard against potentially dividing by zero OR no state/book/coverage lives total
    let livesPercent
    try {
      livesPercent =
        lives / livesTotalsByStateBookCoverage[territoryName][book][coverage]

      if (isNaN(livesPercent)) livesPercent = 0 // if denom is zero, assign livesPercent to 0
    } catch (e) {
      livesPercent = 0
    }

    return {
      ...doc,
      livesPercent,
    }
  })

  await pulseDevDb
    .collection('payerLatestLives')
    .deleteMany({ source, territoryType }, { session })

  await pulseDevDb
    .collection('payerLatestLives')
    .insertMany(latestDataWithLives, { session })
}

module.exports = materializeBreakdown
