module.exports = async getDiffDoc => {
  const comparer = ({
    book,
    coverage,
    // dateTracked,
    link,
    month,
    // organization,
    paLink,
    project,
    regimen,
    siteLink,
    slug,
    year
  }) => [
    book,
    coverage,
    // dateTracked,
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
