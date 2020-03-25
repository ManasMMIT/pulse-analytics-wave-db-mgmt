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
        acc[access] = percentFormatterTo1DecimalPlace(livesPercent)

        return acc
      }, {})

    allAccessValuesUniq.forEach(accessValue => {
      let datumAccessValue = accessBucketsObj[accessValue]

      if (!datumAccessValue) accessBucketsObj[accessValue] = '0.0%'
    })

    return {
      state,
      ...accessBucketsObj,
      'Not Audited': percentFormatterTo1DecimalPlace(1 - auditedLivesPercent),
    }
  })
}

// ! Stolen from wave-app; probably should be moved to util/ directory
const percentageFormatter = (value, decimals = 0) => (
  // #toFixed may result in imperfect rounding,
  // example: 859.385 doesn't round correctly for two decimal places
  [undefined, null].includes(value) ? null : `${(value * 100).toFixed(decimals)}%`
)

const percentageFormatterToNDecimalPlaces = place => value => (
  percentageFormatter(value, place)
)

const percentFormatterTo1DecimalPlace = percentageFormatterToNDecimalPlaces(1)
