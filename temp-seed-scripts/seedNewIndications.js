module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('indicationsFromHistoricalData').deleteMany()

  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const indicationsObj = combinedHistoricalData.reduce((acc, { indication }) => {
    const indicationName = indication
    if (indicationName && !acc[indicationName]) {
      acc[indicationName] = indicationName
    }

    return acc
  }, {})

  const indicationsDocs = Object.keys(indicationsObj).map(name => ({ name }))

  await pulseCore.collection('indicationsFromHistoricalData').insertMany(indicationsDocs)

  console.log('`indications` collection seeded')

}
