const getDiffDoc = require('./getDiffDoc')

module.exports = async ({
  pulseDevStaging,
  pulseDevTest,
}) => {
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
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
    comparer,
    collectionName: 'payerHistoricalPolicyLinks',
  })

  const historicalOp = getDiffDoc({
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
    comparer,
    collectionName: 'payerHistoricalPolicyLinksHt',
  })

  return Promise.all([
    latestMonthOp,
    historicalOp,
  ])
}
