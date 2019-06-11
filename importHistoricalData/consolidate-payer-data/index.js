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
    regimen, book, coverage), work in the DRG and MMIT state lives data so
    we can get a result that's the breakdown of payers and their lives by access
    category for every state for every `treatmentPlan`. We write that result to
    pulse-dev as well.
*/

let consolidatePayerData = async ({
  pulseDevDb,
  pulseCoreDb,
  terminateScript,
}) => {
  try {
    // * Step 1
    const combinedPayerData = await combineQoaScoresLinksCriteria({
      pulseDevDb,
      pulseCoreDb,
      terminateScript
    })

    // * Step 2
    const payerDataWithLives = await combineLives({
      pulseDevDb,
      pulseCoreDb,
      terminateScript,
      payerHistoricalCombinedData: combinedPayerData,
    })
  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script terminating...')
    await terminateScript()
  }
}

consolidatePayerData = connectionWrapper(consolidatePayerData)
module.exports = consolidatePayerData
