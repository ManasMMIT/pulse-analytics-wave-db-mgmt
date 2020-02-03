const _ = require('lodash')

const FALSEY_VALUES = [NaN, undefined, null, '']

const sanitizeKeysAndTrimData = obj => {
  const result = _.reduce(obj, (acc, value, key) => {
    const trimmedKey = key.trim() // in case the key has weird zero width unicode chars
    if (!trimmedKey) return acc
    if (FALSEY_VALUES.includes(value)) value = null // standardize falsey values other than false to be null

    // ! Note: CAMELCASE ALL KEYS EXCEPT _id
    const camelCasedTrimmedKey = trimmedKey === '_id' ? '_id' : _.camelCase(trimmedKey)

    acc[camelCasedTrimmedKey] = typeof value === 'string' ? value.trim() : value
    return acc
  }, {})

  return result
}

const isEmptyRow = obj => {
  for (const key in obj) {
    if (obj[key] !== "") return false
  }

  return true
}

const getSanitizedData = data => data.reduce((acc, row) => {
  const sanitizedRow = sanitizeKeysAndTrimData(row)
  if (isEmptyRow(sanitizedRow)) return acc

  acc.push(sanitizedRow)
  return acc
}, [])

module.exports = getSanitizedData
