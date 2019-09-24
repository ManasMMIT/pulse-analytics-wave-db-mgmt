import XLSX from 'xlsx'
const _ = require('lodash')

const sanitizeKeysAndTrimData = obj => {
  const result = _.reduce(obj, (acc, value, key) => {
    const trimmedKey = key.trim() // in case the key has weird zero width unicode chars
    if (!trimmedKey || value === '') return acc

    acc[_.camelCase(trimmedKey)] = typeof value === 'string' ? value.trim() : value
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

const sheetToJson = sheet => {
  const json = XLSX.utils.sheet_to_json(sheet, { blankrows: true })

  // remove the second and third rows from the json
  const jsonWithFirstTwoRowsRemoved = json.slice(2)
  const numberOfDataRows = jsonWithFirstTwoRowsRemoved.length

  const formattedData = jsonWithFirstTwoRowsRemoved.reduce((acc, row) => {
    const sanitizedRow = sanitizeKeysAndTrimData(row)
    if (isEmptyRow(sanitizedRow)) return acc

    acc.push(sanitizedRow)
    return acc
  }, [])

  const numExcludedRows = numberOfDataRows - formattedData.length

  return { json: formattedData, numExcludedRows }
}

export default sheetToJson
