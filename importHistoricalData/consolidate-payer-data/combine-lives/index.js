const _ = require('lodash')
const d3 = require('d3-collection')
const connectionWrapper = require('../connection-wrapper')
const combineStateLives = require('./combine-state-lives')
const combineNationalLives = require('./combine-national-lives')

// don't include the following states in state lives calculations
const STATES_TO_EXCLUDE = ['GU', 'PR', 'Other']

let combineLives = async ({
  pulseDevDb,
  pulseCoreDb,
  terminateScript,
  payerHistoricalCombinedData,
}) => {
  try {
    console.log('Fetching combined lives data...')
    // fetch all the data we'll need to work with simultaneously upfront
    const [
      payerHistoricalDrgStateLives,
      payerHistoricalMmitStateLives,
      payerDrgStateLivesTotals,
      payerMmitStateLivesTotals,
      payerHistoricalDrgNationalLives,
      payerHistoricalMmitNationalLives,
      payerDrgNationalLivesTotals,
      payerMmitNationalLivesTotals,
      combinedPayerData
    ] = await Promise.all([
      pulseDevDb.collection('payerHistoricalDrgStateLives')
        .find({ state: { $nin: STATES_TO_EXCLUDE } }).toArray(),
      pulseDevDb.collection('payerHistoricalMmitStateLives')
        .find({ state: { $nin: STATES_TO_EXCLUDE } }).toArray(),
      pulseCoreDb.collection('payerDrgStateLivesTotals').find().toArray(),
      pulseCoreDb.collection('payerMmitStateLivesTotals').find().toArray(),
      pulseDevDb.collection('payerHistoricalDrgNationalLives').find().toArray(),
      pulseDevDb.collection('payerHistoricalMmitNationalLives').find().toArray(),
      pulseCoreDb.collection('payerDrgNationalLivesTotals').find().toArray(),
      pulseCoreDb.collection('payerMmitNationalLivesTotals').find().toArray(),
      payerHistoricalCombinedData || pulseDevDb.collection('payerHistoricalCombinedData').find().toArray()
    ])

    console.log('Beginning data crunching for every treatment plan...')
    // group the combinedPayerData by `treatmentPlan` combination
    const payerDataGroupedByTreatmentPlan = d3.nest()
      .key(getTreatmentPlanKey)
      .rollup(arr => _.keyBy(arr, 'slug'))
      .object(combinedPayerData)

    function getTreatmentPlanKey(d) {
      return `${d.indication}|${d.population}|${d.line}|${d.regimen}|${d.book}|${d.coverage}`
    }

    // generate all the state and national lives data for each treatment plan
    const payerDataWithLives = _.map(payerDataGroupedByTreatmentPlan, generateLivesData)
    
    function generateLivesData(combinedPayerDataBySlug, treatmentPlan) {
      const [indication, population, line, regimen, book, coverage] = treatmentPlan.split('|')
      const livesType = getLivesKey(book, coverage)
      
      // combine all the state lives data
      const { DRG_statesData, MMIT_statesData } = combineStateLives({
        payerHistoricalDrgStateLives,
        payerHistoricalMmitStateLives,
        payerDrgStateLivesTotals,
        payerMmitStateLivesTotals,
        livesType,
        combinedPayerDataBySlug,
      })

      // combine all the national lives data
      const { DRG_nationalData, MMIT_nationalData } = combineNationalLives({
        payerHistoricalDrgNationalLives,
        payerHistoricalMmitNationalLives,
        payerDrgNationalLivesTotals,
        payerMmitNationalLivesTotals,
        livesType, 
        combinedPayerDataBySlug,
      })

      return {
        indication,
        population,
        line,
        regimen,
        book,
        coverage,
        treatmentPlan,
        DRG_statesData,
        MMIT_statesData,
        DRG_nationalData,
        MMIT_nationalData
      }
    }

    function getLivesKey(book, coverage) {
      if (book.includes('Medicare')) {
        return _.camelCase(`medicare ${coverage}`)
      }
      return _.camelCase(`${book} ${coverage}`)
    }

    console.log('Data crunching completed; moving onto DB operations.')

    console.log(`Deleting all existing data in 'payerCombinedStateLives' collection...`)
    await pulseDevDb.collection('payerCombinedStateLives').deleteMany()
    console.log('Deletion completed.')

    console.log(`Inserting new data into 'payerCombinedStateLives' collection...`)
    const insertionStartTime = new Date()

    await pulseDevDb.collection('payerCombinedStateLives')
      .insertMany(payerDataWithLives, { ordered: false })

    const insertionEndTime = new Date()
    console.log(`Insertion completed in ${(insertionEndTime - insertionStartTime)/1000}s`)

    return payerDataWithLives
  } catch (e) {
    await terminateScript(e)
  }
}

combineLives = connectionWrapper(combineLives)
module.exports = combineLives
