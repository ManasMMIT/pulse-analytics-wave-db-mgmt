const _ = require('lodash')
const Papa = require('papaparse')
const path = require('path')

const fs = require('fs')
const {
  zipFiles,
  deleteFile,
} = require('./../../utils/fileHandler')
const aggregationPipeline = require('./aggregationPipeline')

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
  'URL_to_PA_Policy',
  'RESTRICTION_CODE',
  'RESTRICTION_DETAIL_TEXT',
  'PROD_NAME',
]

class NovartisCsvController {
  constructor(db) {
    this.db = db

    this.getData = this.getData.bind(this)
    this.getCSVConfigByIndication = this.getCSVConfigByIndication.bind(this)

    this.createFiles = this.createFiles.bind(this)
    this.apiDownloadFiles = this.apiDownloadFiles.bind(this)
  }

  async getData() {
    const result = await this.db.collection('payerHistoricalCombinedData')
      .aggregate(aggregationPipeline, { allowDiskUse: true })
      .toArray()

    const data = result.map(obj => {
      let additionalCriteriaNotes = null

      if (obj.RESTRICTION_DETAIL_TEXT) {
        additionalCriteriaNotes = obj.RESTRICTION_DETAIL_TEXT.map(({ criteriaNotes }) => criteriaNotes)
        additionalCriteriaNotes = additionalCriteriaNotes.join('| ')
      }

      return { ...obj, RESTRICTION_DETAIL_TEXT: additionalCriteriaNotes }
    })

    return data
  }

  getCSVConfigByIndication(indication, result) {
    const date = new Date()
    const formattedDate = date.toJSON().substring(0, 10).replace(/[-]/g, '')

    return {
      fileName: `./exportNovartisCsvData/NOVARTIS_KYMRIAH_${ indication }_${ formattedDate }.csv`,
      csvData: Papa.unparse({
        fields: fieldsOrder,
        data: result.filter(({ INDICATION }) => INDICATION === indication ),
      })
    }
  }

  async createFiles() {
    const result = await this.getData()
    const ALL_config = this.getCSVConfigByIndication('ALL', result)
    const DLBCL_config = this.getCSVConfigByIndication('DLBCL', result)

    const zipFileName = 'novartis_csv_files.zip'
    const zipFilePath = path.resolve(__dirname, zipFileName)

    await zipFiles({
      fileName1: ALL_config.fileName,
      fileName2: DLBCL_config.fileName,
      fileContent1: ALL_config.csvData,
      fileContent2: DLBCL_config.csvData,
      zipFilePath
    })

    return {
      zipFileName,
      zipFilePath
    }
  }

  async apiDownloadFiles(req, res) {
    try {
      const { zipFileName, zipFilePath } = await this.createFiles()

      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': `attachment; filename=${ zipFileName }`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      })

      const readStream = fs.createReadStream(zipFilePath)

      readStream.on('open', () => {
        readStream.pipe(res)
      })

      readStream.on('close', () => {
        readStream.destroy()
        deleteFile(zipFilePath)
      })

      readStream.on('error', err => {
        res.end(err)
      })
    } catch (e) {
      res.sendStatus(500)
    }
  }
}

module.exports = NovartisCsvController
