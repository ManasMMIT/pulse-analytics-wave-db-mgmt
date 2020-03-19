const stringSimilarity = require('string-similarity')

const formatAjvErrors = ({ errors, wb, sheet }) => {
  let errorString = `${wb}/${sheet} failed validation for the following rows:\n\n`

  errorString = errors.reduce((acc, { error, rowNum, datum }) => {
    const { dataPath, message, params } = error

    const key = dataPath.replace('/', '')
    const erroringVal = datum[key]
    
    let suggestion = ''
    if (message === "should be equal to one of the allowed values") {
      const allowedValues = params.allowedValues
      const { bestMatch: { target } } = stringSimilarity.findBestMatch(
        String(erroringVal), 
        allowedValues.map(String)
      )

      suggestion = target
    }

    acc += `Row ${rowNum}, key '${key}' ${message}\n`
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
