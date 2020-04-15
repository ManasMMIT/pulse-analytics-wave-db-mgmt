const sanitize = require('./utils/sanitize')
const validate = require('./utils/validate')
const getSheetConfig = require('./utils/getSheetConfig')
const formatAjvErrors = require('./utils/formatAjvErrors')
const importPayerHistoricalAccessData = require('./importPayerHistoricalAccessData')

const uploadSheet = async (
  parent,
  { input }, // schema is [ { wb, sheet, data, timestamp, projectId }, etc. ]
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const importFeedback = []

  for (const sheetToUpload of input) {
    let { wb, sheet, data, timestamp, projectId } = sheetToUpload
    const originalDataLength = data.length // excludes header

    const { result, skippedRows } = sanitize(data)
    data = result

    const sheetConfig = await getSheetConfig({ wb, sheet, pulseCoreDb }) // handles getting the right sheet config, including for payer historical data exceptions
    const targetCollection = sheetConfig.collection

    const {
      valid,
      errors,
      data: validatedData,
    }  = validate({ data, skippedRows, sheetConfig })

    data = validatedData

    if (!valid) {
      const errorString = formatAjvErrors({ errors, wb, sheet })
      throw new Error(errorString)
    }

    if (timestamp && projectId) {
      await importPayerHistoricalAccessData(
        {
          wb,
          sheet,
          data,
          timestamp,
          projectId,
        },
        { pulseCoreDb, pulseDevDb, mongoClient },
        importFeedback,
      )

      continue
    }

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

  return importFeedback
}

module.exports = uploadSheet
