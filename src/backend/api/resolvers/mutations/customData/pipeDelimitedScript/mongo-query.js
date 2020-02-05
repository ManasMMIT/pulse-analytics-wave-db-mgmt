const _ = require('lodash')
const fs = require('fs')
const { promisify } = require('./util.js')
const { renflexisQuery, merckProjectsPromise } = require('./queries')
const Papa = require('papaparse')

const renflexisDataManipulation = require('./data-manipulation/renflexis-data-manipulation')
const merckDataManipulation = require('./data-manipulation/merck-data-manipulation')

const mongoQuery = db => {
  const payerNationalLivesPromise = db.collection('payerHistoricalDrgNationalLives')
    .find().toArray().then(res => _.keyBy(res, 'slug'))

  return Promise.all([
    merckProjectsPromise(db),
    renflexisQuery(db),
    payerNationalLivesPromise
  ]).then(([
    merckProjectsData,
    renflexisData,
    payerNationalLivesData,
  ]) => {
    const {
      formattedMerckKeytrudaData
    } = merckDataManipulation(payerNationalLivesData, merckProjectsData)
    const formattedRenflexisData = renflexisDataManipulation(payerNationalLivesData, renflexisData)

    return [
      ...formattedRenflexisData,
      ...formattedMerckKeytrudaData
    ]
  }).then(mergedData => {
      const fieldsOrder = [
        'Market',
        'Product',
        'DRG Parent ID',
        'Payer',
        'Payer Channel',
        // 'Coverage',
        'Medical Lives',
        'Access Category',
        // 'Patient Subtype',
        // 'Patient Subpopulation',
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

      const date = new Date()
      const formattedDate = date.toJSON().substring(0, 10).replace(/[-]/g, '')

      fs.mkdirSync('./src/backend/resolvers/mutations/customData/pipeDelimitedScript/exports/', { recursive: true })

      const csvPromise = promisify(`./src/backend/resolvers/mutations/customData/pipeDelimitedScript/exports/DEDHAM_PYR_ACCESS_${formattedDate}.csv`, csv)
      const psvPromise = promisify(`./src/backend/resolvers/mutations/customData/pipeDelimitedScript/exports/DEDHAM_PYR_ACCESS_${formattedDate}.txt`, psv)

      return Promise.all([csvPromise, psvPromise]).then(() => mergedData)
  })
}

module.exports = mongoQuery
