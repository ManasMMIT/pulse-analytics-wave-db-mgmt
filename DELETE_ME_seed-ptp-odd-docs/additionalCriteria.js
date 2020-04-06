const getDiffDoc = require('./getDiffDoc')

module.exports = async ({
  pulseDevStaging,
  pulseDevTest,
}) => {
  const comparer = ({
    book,
    coverage,
    criteria,
    criteriaNotes,
    indication,
    line,
    population,
    project,
    regimen,
    restrictionLevel,
    slug,
    month,
    year,
    // organization,
    // dateTracked,
  }) => [
    book,
    coverage,
    criteria,
    criteriaNotes,
    indication,
    line,
    population,
    project,
    regimen,
    restrictionLevel,
    slug,
    month,
    year,
    // organization,
    // dateTracked,

  ].join('|')

  const latestMonthOp = getDiffDoc({
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
    comparer,
    collectionName: 'payerHistoricalAdditionalCriteria',
  })

  const historicalOp = getDiffDoc({
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
    comparer,
    collectionName: 'payerHistoricalAdditionalCriteriaHt',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
