module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const linesObj = combinedHistoricalData.reduce((acc, { line, lineOfTherapy }) => {
    const lineName = line || lineOfTherapy
    if (lineName && !acc[lineName]) {
      acc[lineName] = lineName
    }

    return acc
  }, {})

  const linesDocs = Object.keys(linesObj).map(name => ({ name }))

  await pulseCore.collection('lines-2').insertMany(linesDocs)

  console.log('`lines` collection seeded')
}
