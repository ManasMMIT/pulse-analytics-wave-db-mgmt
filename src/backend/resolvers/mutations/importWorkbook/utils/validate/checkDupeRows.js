const _ = require('lodash')

const checkDupeRows = (data, skippedRows) => {
  const totalRowCountPlusHeader = skippedRows.length + data.length + 1

  let rowsTracker = {} // for detecting dupes
  let i = 0
  let j = 0
  let curRowNumInSheet = 2 // to keep proper track of row num in sheet, don't start with header row

  while (curRowNumInSheet <= totalRowCountPlusHeader) {
    if (skippedRows[i] === curRowNumInSheet) {
      i++
      curRowNumInSheet++
      continue
    }

    const datum = data[j]

    const serializedDatum = JSON.stringify(datum)
    let entryInRowsTracker = rowsTracker[serializedDatum]
    const newEntry = { datum, rowNum: curRowNumInSheet }

    if (entryInRowsTracker) {
      entryInRowsTracker.push(newEntry)
    } else {
      rowsTracker[serializedDatum] = [newEntry]
    }

    j++
    curRowNumInSheet++
  }

  let isDataValid = true

  const dupeRows = _.filter(rowsTracker, groupOfRows => groupOfRows.length > 1)
  if (dupeRows.length) isDataValid = false

  const errors = []

  dupeRows.forEach(groupOfDupes => {
    const { datum, rowNum } = groupOfDupes[0]

    let errorMessage = `#Duplication Row Error\nRow ${rowNum} is duplicated on row(s) `
    const rowNums = groupOfDupes.slice(1).map(({ rowNum }) => rowNum).join(', ')

    errorMessage += rowNums

    errors.push({
      error: errorMessage,
      rowNum,
      datum,
    })
  })

  return {
    valid: isDataValid,
    errors,
  }
}

module.exports = checkDupeRows
