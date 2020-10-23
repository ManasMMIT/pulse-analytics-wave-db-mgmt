const _ = require('lodash')
const { unflatten } = require('flat')

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

// Remove trailing nulls from sub or superset deltas to not show in view -- eg. ['a', 'b', null, null, null]
// nulls are generated for the before array in the following delta: { field: 'a.2', before: null, after: 2 }
const getCsvValues = (values) => {
  return values.filter((val) => ![undefined, null].includes(val)).join(', ')
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
