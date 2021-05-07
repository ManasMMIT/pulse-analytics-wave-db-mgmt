const sanitize = require('./utils/sanitize')
const validate = require('./utils/validate')
const enrich = require('./utils/enrich')
const getSheetConfig = require('./utils/getSheetConfig')
const formatAjvErrors = require('./utils/formatAjvErrors')
const importPayerHistoricalAccessData = require('./importPayerHistoricalAccessData')
const importPayerHistoricalLivesData = require('./importPayerHistoricalLivesData')
const PayerImportEmitter = require('./PayerImportEmitter')
const importScraperData = require('./importScraperData')

const {
  isQualityAccessSheet,
  isAdditionalCriteriaSheet,
  isPolicyLinksSheet,
} = require('./importPayerHistoricalAccessData/utils')
const { isScraperSheet } = require('./importScraperData/utils')

const importWorkbook = async (
  parent,
  { input }, // schema is [ { wb, sheet, data, timestamp, projectId }, etc. ]
  { pulseCoreDb, pulseDevDb, mongoClient, io, user },
  info
) => {
  const isIncomingDataScraperWorkbook = isScraperSheet(input[0].wb)
  const isIncomingDataPayerWorkbook =
    isQualityAccessSheet(input[0].sheet) ||
    isAdditionalCriteriaSheet(input[0].sheet) ||
    isPolicyLinksSheet(input[0].sheet)

  const isIncomingDataPayerLivesWorkbook =
    input.length === 1 &&
    (/State Lives/.test(input[0].sheet) ||
      /National Lives/.test(input[0].sheet))

  if (isIncomingDataScraperWorkbook) {
    const { wb, data } = input[0]
    const { result } = sanitize(data)
    const pulseScraperDb = mongoClient.db('pulse-scraper')
    const collection = wb.split('_')[0]

    try {
      await importScraperData({
        collection,
        data: result,
        pulseScraperDb,
      })
      return [`Import successful for ${wb} `]
    } catch {
      return [
        `Import unsuccessful for ${wb}. Please reach out to engineering for assistance.`,
      ]
    }
  }

  let payerImportEmitter
  if (isIncomingDataPayerWorkbook) {
    payerImportEmitter = new PayerImportEmitter({
      io,
      pulseCoreDb,
      user,
      projectTimestamp: input[0].timestamp,
      projectId: input[0].projectId,
    })

    await payerImportEmitter.start()
  }

  console.time('Step 1: Validate Sheet')
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
      sideEffectData,
    } = await validate({ data, skippedRows, sheetConfig, db: pulseCoreDb })

    if (!valid) {
      const errorString = formatAjvErrors({ errors, wb, sheet })
      if (isIncomingDataPayerWorkbook) payerImportEmitter.error()
      throw new Error(errorString)
    }

    data = validatedData

    cleanedSheetsWithMetadata.push({
      ...sheetToUpload, // if this is payer historical access import, there'll be projectId and timestamp in here
      data,
      skippedRows,
      originalDataLength,
      targetCollection,
      sideEffectData,
    })
  }

  // Step 2: Detect whether the incoming data is a payer workbook or
  // a standalone sheet; if it's payer workbook, for now let's technically allow
  // someone to be able to import fewer than 3 sheets (that might be wanted).
  //  - If payer workbook, use the importPayerHistoricalAccessData pipeline;
  //  - Else persist straight to pulse-dev for now.
  const importFeedback = []

  console.timeEnd('Step 1: Validate Sheet')

  if (isIncomingDataPayerWorkbook) {
    await importPayerHistoricalAccessData({
      cleanedSheetsWithMetadata,
      dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
      importFeedback,
      payerImportEmitter,
    })
  } else if (isIncomingDataPayerLivesWorkbook) {
    await importPayerHistoricalLivesData({
      sheetObj: cleanedSheetsWithMetadata[0],
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
        sideEffectData,
      } = sheetObjWithMetadata

      // miscellaneous enrichment of data before it's persisted
      data = enrich(data, sideEffectData)

      await pulseDevDb.collection(targetCollection).deleteMany()

      await pulseDevDb.collection(targetCollection).insertMany(data)

      importFeedback.push(
        `Import successful for ${wb}/${sheet}` +
          `\n${data.length}/${originalDataLength} rows imported (excluding header)` +
          `\nSkipped rows were: ${skippedRows.join(', ')}`
      )
    }
  }

  return importFeedback
}

module.exports = importWorkbook
