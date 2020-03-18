const sanitize = require('./utils/sanitize')
const validate = require('./utils/validate')
const importPayerHistoricalData = async args => args
const importData = async args => args
const getSheetConfig = async () => ({})

const uploadSheet = async (
  parent,
  { input }, // schema is [ { wb, sheet, data, timestamp, projectId }, etc. ]
  { pulseCoreDb, mongoClient },
  info
) => {
  for (const sheetToUpload of input) {
    let { wb, sheet, data, timestamp, projectId } = sheetToUpload

    data = sanitize(data)

    const sheetConfig = await getSheetConfig(wb, sheet) // handles getting the right sheet config, including for payer historical data exceptions
    const targetCollection = sheetConfig.collection
    
    const validationResults = validate(data, sheetConfig)

    // depending on validation results, either continue or throw errors as needed

    const importArgs = {
      data,
      timestamp,
      projectId,
      targetCollection,
      pulseCoreDb,
      mongoClient,
    }

    if (timestamp && projectId) {
      await importPayerHistoricalData(importArgs)
      continue
    }

    await importData(importArgs)
  }
  
  return 'Import successful'
}

module.exports = uploadSheet
