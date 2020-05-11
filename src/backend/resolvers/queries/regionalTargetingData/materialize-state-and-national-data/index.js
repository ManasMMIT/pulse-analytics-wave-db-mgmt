const _ = require('lodash')
const combineStateLives = require('./combine-state-lives')
const combineNationalLives = require('./combine-national-lives')

const getLivesKey = (book, coverage) => {
  if (book.includes('Medicare')) {
    return _.camelCase(`medicare ${ coverage }`)
  }
  return _.camelCase(`${ book } ${ coverage }`)
}

// don't include the following states in state lives calculations
const STATES_TO_EXCLUDE = ['GU', 'PR', 'Other']

const materializeStateAndNationalData = async ({
  treatmentPlan,
  payersForSelectedTreatmentPlan,
  isClientRegeneron,
  pulseDevDb,
  pulseCoreDb,
}) => {
  const stateLivesCollection = isClientRegeneron ? 'payerHistoricalMmitStateLives' : 'payerHistoricalDrgStateLives'
  const nationalLivesCollection = isClientRegeneron ? 'payerHistoricalMmitNationalLives' : 'payerHistoricalDrgNationalLives'
  const stateLivesTotalsCollection = isClientRegeneron ? 'payerMmitStateLivesTotals' : 'payerDrgStateLivesTotals'
  const nationalLivesTotalsCollection = isClientRegeneron ? 'payerMmitNationalLivesTotals' : 'payerDrgNationalLivesTotals'

  const stateLivesPromise = pulseDevDb.collection(stateLivesCollection)
    .find({ state: { $nin: STATES_TO_EXCLUDE } }).toArray()

  const nationalLivesPromise = pulseDevDb.collection(nationalLivesCollection).find().toArray()
  
  const stateLivesTotalsPromise = pulseCoreDb.collection(stateLivesTotalsCollection).find().toArray()
  
  const nationalLivesTotalsPromise = pulseCoreDb.collection(nationalLivesTotalsCollection).findOne()

  let [
    stateLives,
    nationalLives,
    stateLivesTotals,
    nationalLivesTotals,
  ] = await Promise.all([
    stateLivesPromise,
    nationalLivesPromise,
    stateLivesTotalsPromise,
    nationalLivesTotalsPromise,
  ])

  const combinedPayerDataBySlug = _.keyBy(payersForSelectedTreatmentPlan, 'slug')
  
  stateLivesTotals = _.keyBy(stateLivesTotals, 'state')

  const { book, coverage } = treatmentPlan
  const livesType = getLivesKey(book, coverage)

  // combine all the state lives data
  const statesDataWithAuditedLives = combineStateLives({
    stateLives,
    stateLivesTotals,
    livesType,
    combinedPayerDataBySlug,
  })

  // combine all the national lives data
  const nationalData = combineNationalLives({
    nationalLives,
    nationalLivesTotals,
    livesType,
    combinedPayerDataBySlug,
  })

  return {
    statesDataWithAuditedLives,
    nationalData,
  }
}

module.exports = materializeStateAndNationalData
