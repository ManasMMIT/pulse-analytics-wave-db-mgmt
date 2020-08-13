const getLatestPipeline = require('./latest-agg-pipeline')
const getSixMonthsPipeline = require('./six-months-agg-pipeline')
const materializeOmniscientPayerMgmtSummary = require('./materializeOmniscientPayerMgmtSummary.js')

module.exports = async ({ pulseCoreDb, pulseDevDb, projectPtpIds }) => {
  // ! Why deleteMany? MUST clear older PTP data; ex: 3/1/2020 data for PTPs are in payerLatestAccess and
  // ! 3/5/2020 data is incoming; the $merge op in materializePayerLatestAccess WON'T
  // ! have any power to delete the 3/1/2020 data, so that must be done first.
  // ! Same idea for payerHistoricalAccess deleteMany op.
  const resetPayerLatestAccessPromise = pulseDevDb
    .collection('payerLatestAccess')
    .deleteMany({ orgTpId: { $in: projectPtpIds } })

  const materializePayerLatestAccess = () =>
    pulseCoreDb
      .collection('organizations.treatmentPlans.history')
      .aggregate(getLatestPipeline(projectPtpIds), { allowDiskUse: true })
      .toArray()

  const resetPayerHistoricalAccessPromise = pulseDevDb
    .collection('payerHistoricalAccess')
    .deleteMany({ orgTpId: { $in: projectPtpIds } })

  const materializePayerHistoricalAccess = () =>
    pulseCoreDb
      .collection('organizations.treatmentPlans.history')
      .aggregate(getSixMonthsPipeline(projectPtpIds), { allowDiskUse: true })
      .toArray()

  await Promise.all([
    resetPayerLatestAccessPromise.then(materializePayerLatestAccess),
    resetPayerHistoricalAccessPromise.then(materializePayerHistoricalAccess),
  ])

  // we intentionally let this op go async without blocking
  console.time('omniscient payer summary page materialization')

  materializeOmniscientPayerMgmtSummary({ pulseDevDb }).then(() => {
    console.log('omniscient payer summary page data updated')
    console.timeEnd('omniscient payer summary page materialization')
  })
}
