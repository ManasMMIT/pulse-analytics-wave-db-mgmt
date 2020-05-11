const _ = require('lodash')

const getCsvKeys = fields => fields.reduce((acc, { name, type }) => {
  if (type === 'csv') acc.push(name)
  return acc
}, [])

const convertCsvToArr = (data, fields) => {
  const csvKeys = getCsvKeys(fields)

  data.forEach(datum => {
    // eslint-disable-next-line no-loop-func
    csvKeys.forEach(csvKey => {
      if (datum[csvKey]) {
        datum[csvKey] = datum[csvKey].split(',')
          .reduce((acc, str) => {
            const trimmedStr = str.trim()

            // skip any value that's trimmed down to an empty string
            if (trimmedStr !== '') acc.push(trimmedStr)

            return acc
          }, [])

        // if the arr is empty after the above step, that means all values were trimmed
        // to nothing and we should just treat the cell as if it's blank; this'll always
        // get defaulted to an empty array later in the process UNLESS oneOf exists and
        // doesn't include an empty string, in which case we need to keep this null
        // to error out later
        if (_.isEmpty(datum[csvKey])) datum[csvKey] = null
      }
    })
  })
}

module.exports = convertCsvToArr
