import XLSX from 'xlsx'

import {
  isEmptyRow,
  sanitizeKeysAndTrimData,
} from '../../utils'

const convertToJson = sheet => {
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

export default convertToJson
