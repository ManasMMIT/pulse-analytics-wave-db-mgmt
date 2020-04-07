module.exports = async getDiffDoc => {
  const comparer = ({
    book,
    coverage,
    dateTracked = null,
    link = null, // if it's not there, sub null for comparison to work
    month,
    // organization,
    paLink = null, // if it's not there, sub null for comparison to work
    project,
    regimen,
    siteLink = null, // if it's not there, sub null for comparison to work
    slug,
    year
  }) => [
    book,
    coverage,
    dateTracked,
    link,
    month,
    // organization,
    paLink,
    project,
    regimen,
    siteLink,
    slug,
    year
  ].join('|')

  const latestMonthOp = getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalPolicyLinks',
  })

  const historicalOp = getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalPolicyLinksHt',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
