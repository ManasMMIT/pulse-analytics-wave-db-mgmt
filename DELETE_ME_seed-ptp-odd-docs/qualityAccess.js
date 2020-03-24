const getDiffDoc = require('./getDiffDoc')

module.exports = async pulseDev => {
  const comparer = ({
    slug,
    organization,
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
    organization,
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
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalQualityAccess',
    newCollectionName: 'payerHistoricalQualityAccess-MATT_TEST',
  })

  const historicalOp = getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalQualityAccessHt',
    newCollectionName: 'payerHistoricalQualityAccessHt-MATT_TEST',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
