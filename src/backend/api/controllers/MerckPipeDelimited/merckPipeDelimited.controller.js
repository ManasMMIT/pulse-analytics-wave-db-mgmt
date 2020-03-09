const _ = require('lodash')
const Papa = require('papaparse')
const path = require('path')
const fs = require('fs')
const {
  zipFiles,
  deleteFile,
} = require('../../../utils/fileHandler')

const renflexisDataManipulation = require('./data-manipulation/renflexis-data-manipulation')
const merckDataManipulation = require('./data-manipulation/merck-data-manipulation')

const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'
const MERCK_PIPE_SCRIPT_USER = 'auth0|5e287871544fad0f3bf5f421'

const fieldsOrder = [
  'Market',
  'Product',
  'DRG Parent ID',
  'Payer',
  'Payer Channel',
  'Medical Lives',
  'Access Category',
  'Access',
  'Policy Date',
  'Review Date'
]

class MerckPipeDelimitedController {
  constructor(db) {
    this.db = db

    this.getRenflexisData = this.getRenflexisData.bind(this)
    this.getMerckProjectData = this.getMerckProjectData.bind(this)
    this.getPayerLivesData = this.getPayerLivesData.bind(this)

    this.getMergedData = this.getMergedData.bind(this)
    this.getCSVandPSVData = this.getCSVandPSVData.bind(this)

    this.createFiles = this.createFiles.bind(this)
    this.apiDownloadFiles = this.apiDownloadFiles.bind(this)
  }

  getRenflexisData() {
    return this.db.collection('renflexisRelativeQoa')
      .find({ coverage: 'Medical' })
      .toArray()
  }

  async getMerckProjectData() {
    const merckAdminResources = await this.db
      .collection('users.nodes.resources')
      .findOne({ _id: MERCK_PIPE_SCRIPT_USER })

    const { treatmentPlans } = merckAdminResources.resources
      .find(({ nodeId }) => nodeId === PAYER_TOOL_ID)

    const queryDocument = {
      indication: { $ne: 'CINV' },
      coverage: 'Medical',
    }

    let treatmentPlanAggStages = []

    treatmentPlans.forEach(indicationObj => {
      const combos = indicationObj.regimens
        .map(({ name: regimenName }) => ({
          regimen: regimenName,
          indication: indicationObj.name,
        }))

      treatmentPlanAggStages = [
        ...treatmentPlanAggStages,
        ...combos,
      ]
    })

    queryDocument['$or'] = treatmentPlanAggStages

    const merckKeytrudaData = await this.db
      .collection('payerHistoricalQualityAccess')
      .find(queryDocument)
      .toArray()

    return { merckKeytrudaData }
  }

  getPayerLivesData() {
    return this.db
      .collection('payerHistoricalDrgNationalLives')
      .find()
      .toArray()
      .then(res => _.keyBy(res, 'slug'))
  }

  async getMergedData() {
    const merckProjectData = await this.getMerckProjectData()
    const renflexisData = await this.getRenflexisData()
    const payerNationalLivesData = await this.getPayerLivesData()

    const { formattedMerckKeytrudaData } = merckDataManipulation(
      payerNationalLivesData, merckProjectData
    )
    const formattedRenflexisData = renflexisDataManipulation(
      payerNationalLivesData, renflexisData
    )

    return [
      ...formattedRenflexisData,
      ...formattedMerckKeytrudaData
    ]
  }

  async getCSVandPSVData() {
    const mergedData = await this.getMergedData()


    const csv = Papa.unparse({
      fields: fieldsOrder,
      data: mergedData
    })

    const psv = Papa.unparse({
      fields: fieldsOrder,
      data: mergedData
    }, {
      delimiter: '|'
    })

    return {
      csv,
      psv
    }
  }

  async createFiles() {
    const { csv, psv } = await this.getCSVandPSVData()

    const date = new Date()
    const zipFileName = 'pipe_delimited_file.zip'

    const formattedDate = date.toJSON().substring(0, 10).replace(/[-]/g, '')
    const csvFileName = `DEDHAM_PYR_ACCESS_${formattedDate}.csv`
    const psvFileName = `DEDHAM_PYR_ACCESS_${formattedDate}.txt`

    const zipFilePath = path.resolve(__dirname, zipFileName)

    await zipFiles({
      fileContent1: csv,
      fileContent2: psv,
      fileName1: csvFileName,
      fileName2: psvFileName,
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

      // This will wait until we know the readable stream is actually valid before piping
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

module.exports = MerckPipeDelimitedController
