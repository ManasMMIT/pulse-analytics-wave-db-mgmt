module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('regimensFromHistoricalData').deleteMany()

  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const regimensObj = combinedHistoricalData.reduce((acc, { regimen }) => {
    const regimenName = regimen
    if (regimenName && !acc[regimenName]) {
      acc[regimenName] = regimenName
    }

    return acc
  }, {})

  const regimensDocs = Object.keys(regimensObj).map(name => ({ name }))

  await pulseCore.collection('regimensFromHistoricalData').insertMany(regimensDocs)

  console.log('`regimens` collection seeded')
}
