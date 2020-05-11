const ajv = require('./initializeAjv')
const getAjvSchema = require('./getAjvSchema')
const convertCsvToArr = require('./convertCsvToArr')
const checkDupeRows = require('./checkDupeRows')

const validate = async ({ data, skippedRows, sheetConfig, db }) => {
  const ajvSchema = await getAjvSchema(sheetConfig.fields, db)
  const ajvValidate = ajv.compile(ajvSchema)

  convertCsvToArr(data, sheetConfig.fields)
  
  const { valid, errors: dupeErrors } = checkDupeRows(data, skippedRows)

  if (!valid) return { valid, errors: dupeErrors }

  let errors = []
  let areAllRowsValid = true
  
  const totalRowCountPlusHeader = skippedRows.length + data.length + 1

  const sideEffectData = []
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

    let valid = true
    let validationErrors = []
    try {
      await ajvValidate(datum)
    } catch (e) {
      valid = false
      validationErrors = e.errors
    }

    if (datum.__SIDE_EFFECT_DATA) {
      sideEffectData.push({
        mutationTargetIdx: j,
        data: datum.__SIDE_EFFECT_DATA
      })

      delete datum.__SIDE_EFFECT_DATA
    }

    if (!valid) {
      validationErrors.forEach(error => { // eslint-disable-line no-loop-func
        errors.push({
          error: error,
          rowNum: curRowNumInSheet,
          datum,
        })
      })

      areAllRowsValid = false
    }

    j++
    curRowNumInSheet++
  }

  return {
    valid: areAllRowsValid,
    errors,
    data,
    sideEffectData
  }
}

module.exports = validate
