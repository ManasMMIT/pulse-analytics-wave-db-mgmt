const _ = require('lodash')
const connectionWrapper = require('./connection-wrapper')
const combineQoaScoresLinksCriteria = require('./combine-qoa-scores-links-criteria')
const combineLives = require('./combine-lives')

/*
  * * PLAN OF ATTACK * *

  STEP 1:
    Join all the latest month/year/project payer data together.
    That means: 1. qoa 2. access scores 3. policy links 4. additional criteria.
    That'll get us `combinedPayerData`, which we'll write to pulse-dev and also
    pass onto the next step.

  STEP 2:
    For every `treatmentPlan` in `combinedPayerData`
    (`treatmentPlan` is combination of indication, population, line,
    regimen, book, coverage), work in the DRG and MMIT state and national lives data so we can: 
      1. Get a result that's the breakdown of payers and their lives by access
      category for every state for every `treatmentPlan`
      2. Get a result that's the breakdown of payers and their lives by access 
      category nationally for every `treatmentPlan`
    We write both results to pulse-dev as well.
*/

let consolidatePayerData = async ({
  pulseDevDb,
  pulseCoreDb,
  terminateScript,
}) => {
  console.log('Beginning payer data consolidation...')

  try {
    // * Step 1
    console.log('Joining qoa, access scores, policy links, add\'l criteria...')
    const combinedPayerData = await combineQoaScoresLinksCriteria({
      pulseDevDb,
      pulseCoreDb,
      terminateScript
    })

    // * Step 2
    console.log('Beginning process to join national and state lives to every treatment plan...')
    await combineLives({
      pulseDevDb,
      pulseCoreDb,
      terminateScript,
      payerHistoricalCombinedData: combinedPayerData,
    })
  } catch(e) {
    await terminateScript(e)
  } finally {
    console.log('Payer data consolidation completed.')
  }
}

consolidatePayerData = connectionWrapper(consolidatePayerData)
module.exports = consolidatePayerData
