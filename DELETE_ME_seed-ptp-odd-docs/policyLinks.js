const getDiffDoc = require('./getDiffDoc')

module.exports = async pulseDev => {
  const comparer = ({
    book,
    coverage,
    dateTracked,
    link,
    month,
    organization,
    paLink,
    project,
    regimen,
    siteLink,
    slug,
    year
  }) => [
    book,
    coverage,
    dateTracked,
    link,
    month,
    organization,
    paLink,
    project,
    regimen,
    siteLink,
    slug,
    year
  ].join('|')

  const latestMonthOp = getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalPolicyLinks',
    newCollectionName: 'payerHistoricalPolicyLinks-MATT_TEST',
  })

  const historicalOp = getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalPolicyLinksHt',
    newCollectionName: 'payerHistoricalPolicyLinksHt-MATT_TEST',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
