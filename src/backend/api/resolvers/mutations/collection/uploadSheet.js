const importPayerHistoricalData = args => args
const sanitizeAndFormat = json => json
const validateData = obj => obj
const importData = args => args

const uploadSheet = async (
  parent,
  { input }, // schema is [ { wb, sheet, data, timestamp, projectId }, etc. ]
  { pulseCoreDb, mongoClient },
  info
) => {
  for (const sheetToUpload of input) {
    let { wb, sheet, data, timestamp, projectId } = sheetToUpload

    data = sanitizeAndFormat(data)
    
    validateData({
      dataParams: { wb, sheet, data }, 
      pulseCoreDb, 
      mongoClient,
    })

    // depending on validation results, either continue or throw errors as needed

    const bundledArgs = {
      dataParams: { wb, sheet, data, timestamp, projectId },
      pulseCoreDb,
      mongoClient,
    }

    if (timestamp && projectId) {
      await importPayerHistoricalData(bundledArgs)

      continue
    }

    await importData(bundledArgs)
  }
  
  return 'Import successful'
}

module.exports = uploadSheet
