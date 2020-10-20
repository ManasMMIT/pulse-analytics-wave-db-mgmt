const _ = require('lodash')
const { unflatten } = require('flat')

const PLACEHOLDER_VALUE = require('./placeholder-value')

const nestedKeyDelimiter = '|||||'

module.exports = (deltas) => {
  const [arrayDeltas, nonArrayDeltas] = _.partition(deltas, ({ field }) => {
    // ! Not covering nested arrays yet -- e.g., { 'a.0.b.1': 2,  'a.1.b.2': 4 }
    const isMultiNestedArray = field.split('.').filter(isIndex).length > 1
    if (isMultiNestedArray) return false

    return field.split('.').some(isIndex)
  })

  let { prev, next } = getPrevAndNextObjects(arrayDeltas)
  prev = unflatten(prev)
  next = unflatten(next)

  const csvArrayDeltas = reformArrayDeltas({ prev, next })

  return [...nonArrayDeltas, ...csvArrayDeltas]
}

const reformArrayDeltas = ({ prev, next }) => {
  return Object.entries(prev).map(([key, values]) => {
    return {
      field: key.replace(nestedKeyDelimiter, '.'),
      before: getCsvValues(values),
      after: getCsvValues(next[key]),
    }
  })
}

// Array element formatting: maintain complete array with `holes` displayed as none.
const getCsvValues = (values) => {
  return values
    .map((val) => (val === null ? PLACEHOLDER_VALUE : val))
    .join(', ')
}

const getPrevAndNextObjects = (deltas) => {
  return deltas.reduce(
    (acc, { field, before, after }) => {
      const fieldKeys = field.split('.')
      const isNested = fieldKeys.length > 1

      // ? reformat nested array field so unflatten keeps it in format keyA.keyB: []
      if (isNested) {
        const nestedFieldsDelimited = fieldKeys
          .slice(0, fieldKeys.length - 1)
          .join(nestedKeyDelimiter)

        field = nestedFieldsDelimited + `.${fieldKeys[fieldKeys.length - 1]}`
      }

      acc.prev[field] = before
      acc.next[field] = after

      return acc
    },
    { prev: {}, next: {} }
  )
}

const isIndex = (key) => {
  return !isNaN(parseInt(key))
}
