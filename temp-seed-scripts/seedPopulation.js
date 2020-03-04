module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('populations-2').deleteMany()

  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const populationsObj = combinedHistoricalData.reduce((acc, { population }) => {
    const populationName = population
    if (populationName && !acc[populationName]) {
      acc[populationName] = populationName
    }

    return acc
  }, {})

  const populationsDocs = Object.keys(populationsObj).map(name => ({ name }))

  await pulseCore.collection('populations-2').insertMany(populationsDocs)

  console.log('`populations` collection seeded')

}
