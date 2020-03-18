const _ = require('lodash')

const NUM_ROWS_TO_SKIP = 2

const FALSEY_VALUES = [NaN, undefined, null, '']

const sanitizeKeysAndTrimData = obj => {
  const result = _.reduce(obj, (acc, value, key) => {
    // ! Note: Trim doesn't remove weird zero width unicode chars; hence the .replace
    const trimmedKey = key.trim().replace(/\u200B/g, '') 

    // Skip columns with blank headers but values in those columns (like random consultant notes)
    // ! Note: SheetJS automatically labels these  columns '__EMPTY_1', '__EMPTY_2', etc.
    if (trimmedKey.match(/__EMPTY/)) return acc
    
    // lowerCamelCase all keys except _id
    // ! Note: _.camelCase happens to have the side effect of removing certain whitespace unicode chars
    // ! that trim fails to do. For example, String.fromCharCode(8203) (unicode zero-width space).
    // ! However, i'm purposely not depending on that side-effect and doing a .replace above.
    const camelCasedTrimmedKey = trimmedKey === '_id' ? '_id' : _.camelCase(trimmedKey)

    if (!camelCasedTrimmedKey) return acc

    // standardize falsey values other than false to be null
    if (FALSEY_VALUES.includes(value)) value = null 

    acc[camelCasedTrimmedKey] = typeof value === 'string' 
    ? value.trim().replace(/\u200B/g, '') // remove all zero-width unicode chars
    : value
    
    return acc
  }, {})

  return result
}

const isEmptyRow = obj => _.every(obj, val => FALSEY_VALUES.includes(val))

const sanitize = data => data.reduce((acc, row, i) => {
  // skip the type row (string, integer, etc.) AND the second row (TDG keys)
  if (i < NUM_ROWS_TO_SKIP) return acc

  // skip any row for which there's a truthy 'skip' value
  if (row.skip) return acc
  delete row.skip // delete any 'skip' key/value pair if skip is falsey

  // trim and camelCase keys unless they're '_id'; trim values if they're strings
  const sanitizedRow = sanitizeKeysAndTrimData(row)

  // if a row's values are all empty strings skip it
  if (isEmptyRow(sanitizedRow)) return acc

  acc.push(sanitizedRow)
  return acc
}, [])

module.exports = sanitize
