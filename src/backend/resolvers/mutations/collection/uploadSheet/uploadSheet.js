const sanitizeAndFormat = require('./utils/sanitizeAndFormat')
const validate = require('./utils/validate')
const importPayerHistoricalData = async args => args
const importData = async args => args
const getWorkbookConfig = async () => ({})

const uploadSheet = async (
  parent,
  { input }, // schema is [ { wb, sheet, data, timestamp, projectId }, etc. ]
  { pulseCoreDb, mongoClient },
  info
) => {
  for (const sheetToUpload of input) {
    let { wb, sheet, data, timestamp, projectId } = sheetToUpload

    data = sanitizeAndFormat(data)

    const workbookConfig = await getWorkbookConfig(wb, sheet) // handles getting the right config, including for payer historical data exceptions
    const targetCollection = workbookConfig.collection
    
    const validationResults = validate(data, workbookConfig)

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
