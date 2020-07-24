const { getNationalLivesTotals } = require('./get-payer-lives')

const persistNationalLivesTotals = async ({
  latestMonthYearData,
  collectionName,
  pulseCoreDb,
  session,
}) => {
  const totalsCollectionName =
    collectionName === 'payerHistoricalDrgNationalLives'
      ? 'payerDrgNationalLivesTotals'
      : 'payerMmitNationalLivesTotals'

  const nationalLivesTotal = getNationalLivesTotals(latestMonthYearData)

  await pulseCoreDb.collection(totalsCollectionName).deleteMany({}, { session })

  await pulseCoreDb
    .collection(totalsCollectionName)
    .insertOne(nationalLivesTotal, { session })

  console.log(`pulse-core collection '${totalsCollectionName}' updated`)
}

module.exports = persistNationalLivesTotals
