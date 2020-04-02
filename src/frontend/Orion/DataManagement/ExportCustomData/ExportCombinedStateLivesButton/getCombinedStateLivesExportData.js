import _ from 'lodash'

export default (combinedStateLivesDoc, source, territoryType) => {
  const {
    statesData,
  } = combinedStateLivesDoc[`${source}_${territoryType}Data`]

  const allAccessValuesWithDupes = statesData.reduce((acc, { accessBuckets }) => {
    const accessBucketValues = Object.keys(
      _.keyBy(accessBuckets, 'access')
    )

    acc = [
      ...acc,
      ...accessBucketValues,
    ]

    return acc
  }, [])

  const allAccessValuesUniq = _.uniq(allAccessValuesWithDupes)

  return statesData.map(({
    state,
    auditedLivesPercent,
    accessBuckets,
  }) => {
    const accessBucketsObj = accessBuckets
      .reduce((acc, { access, livesPercent }) => {
        acc[access] = livesPercent

        return acc
      }, {})

    allAccessValuesUniq.forEach(accessValue => {
      let datumAccessValue = accessBucketsObj[accessValue]

      if (!datumAccessValue) accessBucketsObj[accessValue] = 0
    })

    return {
      state,
      ...accessBucketsObj,
      'Not Audited': 1 - auditedLivesPercent,
    }
  })
}
