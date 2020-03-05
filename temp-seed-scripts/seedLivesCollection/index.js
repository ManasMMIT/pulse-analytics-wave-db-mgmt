const _ = require('lodash')

const getHistoricalDocs = require('./getHistoricalDocs')

module.exports = async pulseCore => {
  await pulseCore.collection('lives').deleteMany()
  
  console.log('`lives` Collection Data Deleted\n')
  
  console.log('Loading Historical Lives Data\n')
  
  const [
    payerHistoricalDrgNationalLives,
    payerHistoricalDrgStateLives,
    payerHistoricalMmitNationalLives,
    payerHistoricalMmitStateLives,
    organizations,
  ] = await Promise.all([
    pulseCore.collection('payerHistoricalDrgNationalLives').find().toArray(),
    pulseCore.collection('payerHistoricalDrgStateLives').find().toArray(),
    pulseCore.collection('payerHistoricalMmitNationalLives').find().toArray(),
    pulseCore.collection('payerHistoricalMmitStateLives').find().toArray(),
    pulseCore.collection('organizations').find().toArray(),
  ])
  
  console.log('Formatting Lives Data\n')
  
  const organizationsHash = _.groupBy(organizations, 'slug')
  
  const drgLivesDocs = getHistoricalDocs({
    historicalDocs: [
      ...payerHistoricalDrgNationalLives,
      ...payerHistoricalDrgStateLives,
    ],
    organizationsHash,
    source: 'DRG',
  })
  
  const mmitLivesDocs = getHistoricalDocs({
    historicalDocs: [
      ...payerHistoricalMmitNationalLives,
      ...payerHistoricalMmitStateLives,
    ],
    organizationsHash,
    source: 'MMIT',
  })
  
  const allLivesDocs = [
    ...drgLivesDocs,
    ...mmitLivesDocs,
  ]
  
  console.log('Seeding Lives Data\n')
  
  await pulseCore.collection('lives').insertMany(allLivesDocs)
  
  console.log('`lives` Collection Finished Seeding\n')
}