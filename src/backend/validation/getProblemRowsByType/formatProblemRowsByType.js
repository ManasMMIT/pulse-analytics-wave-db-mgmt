const stringSimilarity = require('string-similarity')

const ROWS_TO_SKIP = 4

const pushInvalidValues = ({ valueToCheck, validValues, errorArray, sheetRow }) => {
  if (
    valueToCheck
    && !validValues.includes(valueToCheck)
  ) {
    const {
      bestMatch: { target }
    } = stringSimilarity.findBestMatch(valueToCheck, validValues)

    errorArray.push({
      sheetRow,
      value: valueToCheck,
      suggestion: target,
    })
  }
}

const formatProblemRowsByType = (validFieldsByType, data) => (
  data.reduce((acc, row, index) => {
    const { indication, slug, regimen, access } = row

    const isCSVIndications = indication && indication.split(', ').length > 1

    const sheetRow = index + ROWS_TO_SKIP

    const validIndications = validFieldsByType.indication

    const validSlugs = validFieldsByType.slug

    const validRegimens = validFieldsByType.regimen

    const validAccesses = validFieldsByType.access

    if (isCSVIndications) {
      indication.split(', ').forEach(indication => {
        const noTrailingCommaIndication = indication
          .split('')
          .filter(c => c !== ',')
          .join('')

        pushInvalidValues({
          valueToCheck: noTrailingCommaIndication,
          validValues: validIndications,
          errorArray: acc.indication,
          sheetRow,
        })
      })
    } else {
      pushInvalidValues({
        valueToCheck: indication,
        validValues: validIndications,
        errorArray: acc.indication,
        sheetRow,
      })
    }

    pushInvalidValues({
      valueToCheck: slug,
      validValues: validSlugs,
      errorArray: acc.slug,
      sheetRow,
    })

    pushInvalidValues({
      valueToCheck: regimen,
      validValues: validRegimens,
      errorArray: acc.regimen,
      sheetRow,
    })

    pushInvalidValues({
      valueToCheck: access,
      validValues: validAccesses,
      errorArray: acc.access,
      sheetRow,
    })

    return acc
  }, { regimen: [], indication: [], slug: [], access: [] })
)

module.exports = formatProblemRowsByType
