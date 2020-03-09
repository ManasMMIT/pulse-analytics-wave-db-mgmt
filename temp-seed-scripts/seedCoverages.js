module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('coverages').deleteMany()

  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const coveragesObj = combinedHistoricalData.reduce((acc, { coverage }) => {
    const coverageName = coverage
    if (coverageName && !acc[coverageName]) {
      acc[coverageName] = coverageName
    }

    return acc
  }, {})

  const coveragesDocs = Object.keys(coveragesObj).map(name => ({ name }))

  await pulseCore.collection('coverages').insertMany(coveragesDocs)

  console.log('`coverages` collection seeded')

}
