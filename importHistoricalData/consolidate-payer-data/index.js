const _ = require('lodash')
const connectionWrapper = require('./connection-wrapper')
const combineQoaScoresLinksCriteria = require('./combine-qoa-scores-links-criteria')

/*
  * * PLAN OF ATTACK * *
  Join all the latest month/year/project payer data together.
  That means: 1. qoa 2. access scores 3. policy links 4. additional criteria.
  That'll get us `combinedPayerData`, which we'll write to pulse-dev. That
  collection is used by the resolvers for payer plan lookup and the 
  regional targeting page.
*/

let consolidatePayerData = async ({
  pulseDevDb,
  pulseCoreDb,
  terminateScript,
}) => {
  console.log('Beginning payer data consolidation...')

  try {
    console.log('Joining qoa, access scores, policy links, add\'l criteria...')
    
    await combineQoaScoresLinksCriteria({
      pulseDevDb,
      pulseCoreDb,
      terminateScript
    })
  } catch(e) {
    await terminateScript(e)
  } finally {
    console.log('Payer data consolidation completed.')
  }
}

consolidatePayerData = connectionWrapper(consolidatePayerData)
module.exports = consolidatePayerData
