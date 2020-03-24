const getDiffDoc = require('./getDiffDoc')

module.exports = async pulseDev => {
  const comparer = ({
    book,
    coverage,
    criteria,
    criteriaNotes,
    dateTracked,
    indication,
    line,
    month,
    organization,
    population,
    project,
    regimen,
    restrictionLevel,
    slug,
    year,
  }) => [
    book,
    coverage,
    criteria,
    criteriaNotes,
    dateTracked,

    indication,
    line,
    month,
    organization,
    population,
    project,
    regimen,
    restrictionLevel,
    slug,
    year,

  ].join('|')

  const latestMonthOp = getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalAdditionalCriteria',
    newCollectionName: 'payerHistoricalAdditionalCriteria-MATT_TEST',
  })

  const historicalOp = getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalAdditionalCriteriaHt',
    newCollectionName: 'payerHistoricalAdditionalCriteriaHt-MATT_TEST',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
