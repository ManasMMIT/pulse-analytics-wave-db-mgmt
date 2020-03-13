const _ = require('lodash')

const getHistoricalDocs = require('./getHistoricalDocs')

// ! MSA lives are NOT handled by this script and are being ignored for now
module.exports = async ({
  pulseCore,
  payerOrganizationsBySlug,
}) => {
  await pulseCore.collection('lives.history').deleteMany()

  console.log('`lives.history` Collection Data Deleted\n')

  console.log('Loading Historical Lives Data\n')

  const [
    payerHistoricalDrgNationalLives,
    payerHistoricalDrgStateLives,
    payerHistoricalMmitNationalLives,
    payerHistoricalMmitStateLives,
  ] = await Promise.all([
    pulseCore.collection('payerHistoricalDrgNationalLives').find().toArray(),
    pulseCore.collection('payerHistoricalDrgStateLives').find().toArray(),
    pulseCore.collection('payerHistoricalMmitNationalLives').find().toArray(),
    pulseCore.collection('payerHistoricalMmitStateLives').find().toArray(),
  ])

  console.log('Formatting Lives Data\n')

  const drgLivesDocs = getHistoricalDocs({
    historicalDocs: [
      ...payerHistoricalDrgNationalLives,
      ...payerHistoricalDrgStateLives,
    ],
    organizationsHash: payerOrganizationsBySlug,
    source: 'DRG',
  })

  const mmitLivesDocs = getHistoricalDocs({
    historicalDocs: [
      ...payerHistoricalMmitNationalLives,
      ...payerHistoricalMmitStateLives,
    ],
    organizationsHash: payerOrganizationsBySlug,
    source: 'MMIT',
  })

  const allLivesDocs = [
    ...drgLivesDocs,
    ...mmitLivesDocs,
  ]

  console.log('Seeding Lives Data\n')

  await pulseCore.collection('lives.history').insertMany(allLivesDocs)

  console.log('`lives.history` Collection Finished Seeding\n')
}
