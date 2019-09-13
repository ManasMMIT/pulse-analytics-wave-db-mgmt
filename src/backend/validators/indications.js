const _ = require('lodash')
const stringSimilarity = require('string-similarity')

const validateIndications = async ({ pulseCoreDb, rawJson, next }) => {
  const indications = await pulseCoreDb.collection('indications').find().toArray()
  const validIndications = _.keyBy(indications, 'name')
  
  // add 1 for zero indexing, add 3 for rows skipped
  // (there are two special rows in the xlsx file and the header)
  const ROWS_TO_SKIP = 4
  
  const problemRows = []
  const invalidIndications = rawJson.filter(({ indication }, i) => {
    const isIndicationInvalid = !validIndications[indication]
    if (isIndicationInvalid) problemRows.push(i + ROWS_TO_SKIP)
    return isIndicationInvalid
  })
  
  const numInvalidIndications = invalidIndications.length
  
  if (numInvalidIndications > 0) {
    const uniqueInvalidIndications = _.uniqBy(invalidIndications, 'indication').map(({ indication }) => indication)
  
    const validIndicationArr = Object.keys(validIndications)
    const suggestions = uniqueInvalidIndications.map(invalidIndication => {
      const { bestMatch: { target } } = stringSimilarity.findBestMatch(invalidIndication, validIndicationArr)
      return { 'Invalid Indication': invalidIndication, 'Did you mean...?': target }
    })
  
    let errorMessage = `
            Indication validation failed!
            Incoming data has ${numInvalidIndications} invalid indication entries.
            Problem rows in CSV are: ${problemRows.join(', ')}
            Your unique invalid indications are:
            ${ suggestions}
          `
  
    console.table(suggestions, ['Invalid Indication', 'Did you mean...?'])
  
    next(errorMessage)
    return
  }
}

module.exports = validateIndications
