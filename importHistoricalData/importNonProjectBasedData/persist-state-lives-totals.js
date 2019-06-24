const { getStateLivesTotals } = require('./get-payer-lives')

const persistStateLivesTotals = async ({
  latestMonthYearData,
  collectionName,
  pulseCoreDb,
}) => {
  const totalsCollectionName = collectionName === 'payerHistoricalDrgStateLives'
    ? 'payerDrgStateLivesTotals'
    : 'payerMmitStateLivesTotals'

  const stateLivesTotals = getStateLivesTotals(latestMonthYearData)

  await pulseCoreDb.collection(totalsCollectionName).deleteMany()
  await pulseCoreDb.collection(totalsCollectionName).insertMany(stateLivesTotals)

  console.log(`pulse-core collection '${totalsCollectionName}' updated`)
}

module.exports = persistStateLivesTotals
