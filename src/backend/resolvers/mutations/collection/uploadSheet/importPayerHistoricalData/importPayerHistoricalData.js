const {
  getIsQualityAccessSheet,
  getIsAdditionalCriteriaSheet,
  getIsPolicyLinksSheet,
} = require('./utils')
const SheetToCore = require('./SheetToCore/Manager')
// const PayerHistoryManager = require('./PayerHistoryManager')

// ? FOR FUTURE: random global tracker to indicate when to trigger combo materialization functions
// let tracker = 0

// ? FOR FUTURE:  somehow instantiate outside so it doesn't hvae to be instantiated every time, every call
// const globalPayerHistoryManager = new PayerHistoryManager({
//   pulseDev: pulseDevDb,
//   pulseCore: pulseCoreDb,
// })

const importHistoricalProjectData = async (
  {
    wb, // TODO: will probably be used for string going into import feedback
    sheet,
    data,
    timestamp,
    projectId,
  },
  { pulseCoreDb, pulseDevDb, mongoClient },
  importFeedback, // TODO: add success messages to importFeedback array on success (mutate this array)
) => {
  const isQualityAccessSheet = getIsQualityAccessSheet(sheet)
  const isAdditionalCriteriaSheet = getIsAdditionalCriteriaSheet(sheet)
  const isPolicyLinksSheet = getIsPolicyLinksSheet(sheet)

  const sheetToCoreManager = new SheetToCore({
    projectId,
    pulseCore: pulseCoreDb,
  })

  if (isQualityAccessSheet) {
    await sheetToCoreManager.validateQualityOfAccess(data)
    // await sheetToCoreManager.upsertQoa()
  } else if (isAdditionalCriteriaSheet) {
    await sheetToCoreManager.validateAdditionalCriteria(data)
    // await sheetToCoreManager.upsertAddlCriteria()
  } else if (isPolicyLinksSheet) {
    await sheetToCoreManager.validatePolicyLinks(data)
    // await sheetToCoreManager.upsertPolicyLinks()
  }

  await sheetToCoreManager
    .upsertOrgTpHistory({
      sheetData: data,
      sheetName: sheet,
      timestamp,
    })

  // // ? TODO: Matt builds up success string and adds memoized importFeedback array

  // // ? let successString = `${wb}/${sheet} successfully updated in CORE DB for ${timestamp}`

  // const payerHistoryManager = new PayerHistoryManager({
  //   pulseDev: pulseDevDb,
  //   pulseCore: pulseCoreDb,
  // })

  // await payerHistoryManager.materializeNonLivesCollections()

  // ? successString += 'successfully materialized data in DEV DB \n'
  // importFeedback.push(successString)

  /* ? IDEA FOR FUTURE: ISOLATE WHAT'S MATERIALIZED BASED ON WHAT'S INCOMING

  const payerHistoryManager = globalPayerHistoryManager

  if (sheet === 'qoa') {
    await payerHistoryManager.materializeQoa()
    tracker++
  } else if (sheet === 'addl criteria') {
    await payerHistoryManager.materializeAddlCriteria()
    tracker++
  } else if (sheet === 'policy links') {
    await payerHistoryManager.materializePolicyLinks()
    tracker++
  }

  if (tracker === 3) {
    materializeExpensiveCombinationCollections()
    tracker = 0; // reset tracker
  }
  */

  return 'Success'
}

/*

function materializeExpensiveCombinationCollections() {
  await payerHistoryManager.materializeCombinedNonLivesData()
  await payerHistoryManager.materializeRegionalTargetingData()
}

*/

module.exports = importHistoricalProjectData
