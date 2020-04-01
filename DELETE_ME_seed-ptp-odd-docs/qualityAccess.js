module.exports = async getDiffDoc => {
  const comparer = ({
    slug,
    // organization,
    indication,
    population,
    line,
    regimen,
    access,
    tier,
    tierRating,
    coverage,
    book,
    project,
    month,
    year,
  }) => [
    slug,
    // organization,
    indication,
    population,
    line,
    regimen,
    access,
    tier,
    tierRating,
    coverage,
    book,
    project,
    month,
    year,
  ].join('|')

  const latestMonthOp = getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalQualityAccess',
  })

  const historicalOp = getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalQualityAccessHt',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
