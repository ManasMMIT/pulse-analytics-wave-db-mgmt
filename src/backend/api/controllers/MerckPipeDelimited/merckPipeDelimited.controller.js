const _ = require('lodash')
const Papa = require('papaparse')
const { promisify } = require('./util')
const path = require('path')

const renflexisDataManipulation = require('./utils/renflexis-data-manipulation')
const merckDataManipulation = require('./utils/merck-data-manipulation')

const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'
const MERCK_PIPE_SCRIPT_USER = 'auth0|5e287871544fad0f3bf5f421'

const getFilePath = fileName => path.resolve(__dirname, fileName)

class MerckPipeDelimitedController {
  constructor(db) {
    this.db = db

    this.getRenflexisData = this.getRenflexisData.bind(this)
    this.getMerckProjectData = this.getMerckProjectData.bind(this)
    this.getPayerLivesData = this.getPayerLivesData.bind(this)

    this.getMergedData = this.getMergedData.bind(this)
    this.getCSVandPSVData = this.getCSVandPSVData.bind(this)

    this.apiCreateFiles = this.apiCreateFiles.bind(this)
  }

  async getRenflexisData() {
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

  async getPayerLivesData() {
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

  async apiCreateFiles(req, res) {
    try {
      const { csv, psv } = await this.getCSVandPSVData()

      const date = new Date()
      const formattedDate = date.toJSON().substring(0, 10).replace(/[-]/g, '')

      const csvFilePath = getFilePath(`DEDHAM_PYR_ACCESS_${formattedDate}.csv`)
      const psvFilePath = getFilePath(`DEDHAM_PYR_ACCESS_${formattedDate}.txt`)

      const csvFile = await promisify(csvFilePath, csv)
      const psvFile = await promisify(psvFilePath, psv)

      console.log('file created')

      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  }
}

module.exports = MerckPipeDelimitedController