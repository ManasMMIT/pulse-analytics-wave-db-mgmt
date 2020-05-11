const sanitize = require('./utils/sanitize')
const validate = require('./utils/validate')
const getSheetConfig = require('./utils/getSheetConfig')
const formatAjvErrors = require('./utils/formatAjvErrors')
const importPayerHistoricalAccessData = require('./importPayerHistoricalAccessData')

const {
  isQualityAccessSheet,
  isAdditionalCriteriaSheet,
  isPolicyLinksSheet,
} = require('./importPayerHistoricalAccessData/utils')

const uploadSheet = async (
  parent,
  { input }, // schema is [ { wb, sheet, data, timestamp, projectId }, etc. ]
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  // Step 1: Completely sanitize and validate the data (across all incoming sheets)
  // If anything fails, error is thrown right away and no further code executes.
  const cleanedSheetsWithMetadata = []

  for (const sheetToUpload of input) {
    let { wb, sheet, data } = sheetToUpload
    const originalDataLength = data.length // excludes header

    const { result, skippedRows } = sanitize(data)
    data = result

    const sheetConfig = await getSheetConfig({ wb, sheet, pulseCoreDb }) // handles getting the right sheet config, including for payer historical data exceptions
    
    const targetCollection = sheetConfig.collection

    const {
      valid,
      errors,
      data: validatedData,
    } = await validate({ data, skippedRows, sheetConfig, db: pulseCoreDb })

    data = validatedData

    if (!valid) {
      const errorString = formatAjvErrors({ errors, wb, sheet })
      throw new Error(errorString)
    }

    cleanedSheetsWithMetadata.push({
      ...sheetToUpload, // if this is payer historical access import, there'll be projectId and timestamp in here
      data,
      skippedRows,
      originalDataLength,
      targetCollection,
    })
  }

  // Step 2: Detect whether the incoming data is a payer workbook or
  // a standalone sheet; if it's payer workbook, for now let's technically allow
  // someone to be able to import fewer than 3 sheets (that might be wanted).
  //  - If payer workbook, use the importPayerHistoricalAccessData pipeline;
  //  - Else persist straight to pulse-dev for now.
  const importFeedback = []

  const isIncomingDataPayerWorkbook = isQualityAccessSheet(input[0].sheet)
    || isAdditionalCriteriaSheet(input[0].sheet)
    || isPolicyLinksSheet(input[0].sheet)

  if (isIncomingDataPayerWorkbook) {
    await importPayerHistoricalAccessData({
      cleanedSheetsWithMetadata,
      dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
      importFeedback,
    })
  } else {
    for (const sheetObjWithMetadata of cleanedSheetsWithMetadata) {
      let {
        wb,
        sheet,
        data,
        skippedRows,
        originalDataLength,
        targetCollection,
      } = sheetObjWithMetadata

      // for data going straight to dev, tack on createdOn to every doc
      const createdOn = new Date()
      data = data.map(datum => ({ ...datum, createdOn }))

      await pulseDevDb.collection(targetCollection)
        .deleteMany()

      await pulseDevDb.collection(targetCollection)
        .insertMany(data)

      importFeedback.push(
        `Import successful for ${wb}/${sheet}`
        + `\n${data.length}/${originalDataLength} rows imported (excluding header)`
        + `\nSkipped rows were: ${skippedRows.join(', ')}`
      )
    }
  }

  return importFeedback
}

module.exports = uploadSheet
