const _ = require('lodash')
const connectionWrapper = require('./connection-wrapper')

let combineQoaScoresLinksCriteria = async ({
  pulseDevDb,
  pulseCoreDb,
  terminateScript,
}) => {
  try {
    // fetch all the data we'll need to work with simultaneously upfront
    const [
      payerHistoricalQualityAccess,
      qualityAccessScores,
      payerHistoricalPolicyLinks,
      payerHistoricalAdditionalCriteria,
    ] = await Promise.all([
      pulseDevDb.collection('payerHistoricalQualityAccess').find().toArray(),
      pulseCoreDb.collection('qualityAccessScores').find().toArray(), // this master collection is in CORE
      pulseDevDb.collection('payerHistoricalPolicyLinks').find().toArray(),
      pulseDevDb.collection('payerHistoricalAdditionalCriteria').find().toArray(),
    ])

    // Starting point is payerHistoricalQualityAccess
    let combinedPayerData = _.merge([], payerHistoricalQualityAccess)

    // First join the access properties such as score to combinedPayerData
    const accessScoresByAccess = _.keyBy(qualityAccessScores, 'access')
    // WARNING: order of destructuring matters here! otherwise obj's _id is overwritten, resulting in dup keys
    combinedPayerData = combinedPayerData.map(obj => ({ ...accessScoresByAccess[obj.access], ...obj }))

    // Next join the policy links
    const policyLinksHash = _.keyBy(
      payerHistoricalPolicyLinks,
      d => `${d.slug} ${d.regimen} ${d.book} ${d.coverage}`
    )

    combinedPayerData.forEach(obj => {
      const { slug, regimen, book, coverage } = obj
        const comboKey = `${slug} ${regimen} ${book} ${coverage}`
        if (policyLinksHash[comboKey]) {
          obj.policyLink = policyLinksHash[comboKey].link
          obj.siteLink = policyLinksHash[comboKey].siteLink
        }
    })

    // Join the additional criteria
    const addlCriteriaHash = _.groupBy(
      payerHistoricalAdditionalCriteria,
      d => `${d.slug} ${d.indication} ${d.population} ${d.line} ${d.coverage} ${d.book} ${d.regimen}`
    )

    combinedPayerData.forEach(obj => {
      const {
        slug,
        indication,
        population,
        line,
        coverage,
        book,
        regimen,
      } = obj

      const comboKey = `${slug} ${indication} ${population} ${line} ${coverage} ${book} ${regimen}`
      if (addlCriteriaHash[comboKey]) {
        obj.additionalCriteria = addlCriteriaHash[comboKey]
      }
    })

    // * Write the combinedPayerData to MongoDB
    await pulseDevDb.collection('payerHistoricalCombinedData').deleteMany()
    await pulseDevDb.collection('payerHistoricalCombinedData').insertMany(combinedPayerData)
    console.log(`pulse-core collection 'payerHistoricalCombinedData' updated`)

    return combinedPayerData
  } catch (e) {
    await terminateScript(e)
  }
}

combineQoaScoresLinksCriteria = connectionWrapper(combineQoaScoresLinksCriteria)
module.exports = combineQoaScoresLinksCriteria

/*
Saving snippet below for potential future use:
Join whether account has been profiled

const profiledPayerHash = _.keyBy(payerOrganizationOverview, 'slug')

combinedPayerData.forEach(obj => {
  if (profiledPayerHash[obj.slug]) {
    obj.isProfiled = true
  } else {
    obj.isProfiled = false
  }
})
*/
