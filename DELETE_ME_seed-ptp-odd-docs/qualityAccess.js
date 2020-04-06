const getDiffDoc = require('./getDiffDoc')

module.exports = async ({
  pulseDevStaging,
  pulseDevTest,
}) => {
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
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
    comparer,
    collectionName: 'payerHistoricalQualityAccess',
  })

  const historicalOp = getDiffDoc({
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
    comparer,
    collectionName: 'payerHistoricalQualityAccessHt',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
