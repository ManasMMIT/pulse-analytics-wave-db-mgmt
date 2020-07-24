const { getStateLivesTotals } = require('./get-payer-lives')

const persistStateLivesTotals = async ({
  latestMonthYearData,
  collectionName,
  pulseCoreDb,
  session,
}) => {
  const totalsCollectionName =
    collectionName === 'payerHistoricalDrgStateLives'
      ? 'payerDrgStateLivesTotals'
      : 'payerMmitStateLivesTotals'

  const stateLivesTotals = getStateLivesTotals(latestMonthYearData)

  await pulseCoreDb.collection(totalsCollectionName).deleteMany({}, { session })

  await pulseCoreDb
    .collection(totalsCollectionName)
    .insertMany(stateLivesTotals, { session })

  console.log(`pulse-core collection '${totalsCollectionName}' updated`)
}

module.exports = persistStateLivesTotals
