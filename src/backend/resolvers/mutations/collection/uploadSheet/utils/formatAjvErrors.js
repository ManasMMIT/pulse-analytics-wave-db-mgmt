const stringSimilarity = require('string-similarity')

const formatAjvErrors = ({ errors, wb, sheet }) => {
  let errorString = `${wb}/${sheet} failed validation for the following rows:\n\n`

  errorString = errors.reduce((acc, { error, rowNum, datum }) => {
    if (typeof error === 'string') {
      acc += (error + '\n')
      return acc
    }

    const { dataPath, message, params } = error

    let key = dataPath.replace('/', '') // replaces the first slash only on purpose
    let erroringVal = datum[key]

    const matchForCsvPath = key.match(/^(\w+)\/([0-9]{1,})$/)
    
    let extraErrorStr = ' '
    if (matchForCsvPath) {
      key = matchForCsvPath[1]
      const idxOfInvalidCsvVal = Number(matchForCsvPath[2])
      erroringVal = datum[key][idxOfInvalidCsvVal]

      extraErrorStr = `, csv position ${idxOfInvalidCsvVal + 1} `
    }
    
    let suggestion = ''
    if (message === "should be equal to one of the allowed values") {
      const allowedValues = params.allowedValues
      const { bestMatch: { target } } = stringSimilarity.findBestMatch(
        String(erroringVal), 
        allowedValues.map(String)
      )

      suggestion = target
    }

    acc += `Row ${rowNum}, key '${key}'${extraErrorStr}${message}\n`
    if (suggestion) {
      acc += `Did you mean: '${suggestion}'?\n\n`
    } else {
      acc += '\n'
    }

    return acc
  }, errorString)

  return errorString
}

module.exports = formatAjvErrors
