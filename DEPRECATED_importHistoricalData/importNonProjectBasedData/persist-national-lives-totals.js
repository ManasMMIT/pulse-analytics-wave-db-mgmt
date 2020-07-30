const { getNationalLivesTotals } = require('./get-payer-lives')

const persistNationalLivesTotals = async ({
  latestMonthYearData,
  collectionName,
  pulseCoreDb,
}) => {
  const totalsCollectionName = collectionName === 'payerHistoricalDrgNationalLives'
    ? 'payerDrgNationalLivesTotals'
    : 'payerMmitNationalLivesTotals'

  const nationalLivesTotal = getNationalLivesTotals(latestMonthYearData)
  
  await pulseCoreDb.collection(totalsCollectionName).deleteMany()
  await pulseCoreDb.collection(totalsCollectionName).insertOne(nationalLivesTotal)

  console.log(`pulse-core collection '${totalsCollectionName}' updated`)
}

module.exports = persistNationalLivesTotals
