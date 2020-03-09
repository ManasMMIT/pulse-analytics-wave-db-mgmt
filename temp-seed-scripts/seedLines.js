module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('lines').deleteMany()

  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const linesObj = combinedHistoricalData.reduce((acc, { line }) => {
    if (line && !acc[line]) {
      acc[line] = line
    }

    return acc
  }, {})

  const linesDocs = Object.keys(linesObj).map(name => ({ name }))

  await pulseCore.collection('lines').insertMany(linesDocs)

  console.log('`lines` collection seeded')
}
