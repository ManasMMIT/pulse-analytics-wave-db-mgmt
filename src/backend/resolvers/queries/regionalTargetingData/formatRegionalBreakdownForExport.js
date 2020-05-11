const formatRegionalBreakdownForExport = regionalData => {
  let allUniqAccessValues = regionalData.reduce((acc, { accessBuckets }) => {
    accessBuckets.forEach(({ access }) => acc.add(access))
    return acc
  }, new Set())

  allUniqAccessValues = Array.from(allUniqAccessValues)

  const result = regionalData.map(({
    region,
    auditedLivesPercent,
    accessBuckets,
  }) => {
    const accessBucketsObj = accessBuckets
      .reduce((acc, { access, livesPercent }) => {
        acc[access] = livesPercent

        return acc
      }, {})

    allUniqAccessValues.forEach(accessValue => {
      let datumAccessValue = accessBucketsObj[accessValue]

      if (!datumAccessValue) accessBucketsObj[accessValue] = 0
    })

    return {
      region,
      ...accessBucketsObj,
      'Not Audited': 1 - auditedLivesPercent,
    }
  })

  return result
}

module.exports = formatRegionalBreakdownForExport
