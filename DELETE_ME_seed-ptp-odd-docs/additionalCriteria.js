module.exports = async getDiffDoc => {
  const comparer = ({
    book,
    coverage,
    criteria,
    criteriaNotes,
    indication,
    line,
    population,
    // project,
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
    // project,
    regimen,
    restrictionLevel,
    slug,
    month,
    year,
    // organization,
    // dateTracked,
  ].join('|')

  const latestMonthOp = getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalAdditionalCriteria',
  })

  const historicalOp = getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalAdditionalCriteriaHt',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
