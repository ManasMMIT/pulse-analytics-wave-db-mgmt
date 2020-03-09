const _ = require('lodash')

const getHistoricalDocs = require('./getHistoricalDocs')

// ! MSA lives are NOT handled by this script and are being ignored for now
module.exports = async pulseCore => {
  await pulseCore.collection('lives.history').deleteMany()
  
  console.log('`lives.history` Collection Data Deleted\n')
  
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
  
  await pulseCore.collection('lives.history').insertMany(allLivesDocs)
  
  console.log('`lives.history` Collection Finished Seeding\n')
}