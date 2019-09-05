const Papa = require('papaparse')
const fs = require('fs')
const connectToMongoDb = require('../connect-to-mongodb')
const { getScriptTerminator } = require('../utils')
const aggregationPipeline = require('./aggregationPipeline')

const connectToMongoAndWriteCsv = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  let result = await pulseDevDb.collection('payerHistoricalCombinedData')
    .aggregate(aggregationPipeline, { allowDiskUse: true })
    .toArray()

  result = result.map(obj => {
    let additionalCriteriaNotes = null

    if (obj.RESTRICTION_DETAIL_TEXT) {
      additionalCriteriaNotes = obj.RESTRICTION_DETAIL_TEXT.map(({ criteriaNotes }) => criteriaNotes)
      additionalCriteriaNotes = additionalCriteriaNotes.join('| ')
    }

    return { ...obj, RESTRICTION_DETAIL_TEXT: additionalCriteriaNotes }
  })

  const fieldsOrder = [
    'STATE_CD',
    'STATE_NAME',
    'PLAN_ID',
    'PayerName',
    'PLAN_NAME',
    'LIVES',
    'PLAN_TYPE',
    'TIER',
    'TIER_NUMBER',
    'INDICATION',
    'DW_INS_DT',
    'PA_URL',
    'URL_TO_PA_Policy',
    'RESTRICTION_CODE',
    'RESTRICTION_DETAIL_TEXT',
    'PROD_NAME',
  ]

  const date = new Date()
  const formattedDate = date.toJSON().substring(0, 10).replace(/[-]/g, '')
  const getCSVConfigByIndication = indication => ({
    filename: `./exportNovartisCsvData/NOVARTIS_KYMRIAH_${ indication }_${formattedDate}.csv`,
    csvData: Papa.unparse({
      fields: fieldsOrder,
      data: result.filter(({ INDICATION }) => INDICATION === indication ),
    })
  })

  const ALL_config = getCSVConfigByIndication('ALL')
  const DLBCL_config = getCSVConfigByIndication('DLBCL')

  const writeToCsv = ({ filename, csvData }) => new Promise((resolve, reject) => {
    fs.writeFile(filename, csvData, err => {
      if (err) {
        console.log(`Error writing to ${filename}`)
        reject(err)
      } else {
        console.log(`Successfully written to ${filename}`)
        resolve()
      }
    })
  })

  await writeToCsv(ALL_config)
  await writeToCsv(DLBCL_config)

  await terminateScript()
}

connectToMongoAndWriteCsv()
