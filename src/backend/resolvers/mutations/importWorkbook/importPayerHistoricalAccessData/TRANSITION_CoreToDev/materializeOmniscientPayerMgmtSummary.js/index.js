const _ = require('lodash')
const omniscientPayerManagementSummaryAggPipeline = require('./omniscient-payer-summary-agg-pipeline')

const sortByRestrictivenessAndAccess = (data) => {
  data.forEach((datum) => {
    datum.restrictiveBuckets = _.orderBy(
      datum.restrictiveBuckets,
      ['isRestrictive'],
      ['desc']
    )

    datum.restrictiveBuckets.forEach((bucket) => {
      bucket.accessBuckets = _.orderBy(
        bucket.accessBuckets,
        ['access.sortOrder'],
        ['desc']
      )
    })
  })
}

module.exports = async ({ pulseDevDb }) => {
  await pulseDevDb.collection('omniscientPayerManagementSummary').deleteMany()

  const result = await pulseDevDb
    .collection('payerLatestAccess')
    .aggregate(omniscientPayerManagementSummaryAggPipeline, {
      allowDiskUse: true,
    })
    .toArray()

  sortByRestrictivenessAndAccess(result)

  await pulseDevDb
    .collection('omniscientPayerManagementSummary')
    .insertMany(result)
}
