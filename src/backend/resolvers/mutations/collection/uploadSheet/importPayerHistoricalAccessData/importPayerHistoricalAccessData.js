const {
  getIsQualityAccessSheet,
  getIsAdditionalCriteriaSheet,
  getIsPolicyLinksSheet,
} = require('./utils')
const SheetToCore = require('./SheetToCore/ManagerFactory')
const Validator = require('./SheetToCore/Validator')
// const CoreToDev = require('./CoreToDev')

// ? FOR FUTURE: random global tracker to indicate when to trigger combo materialization functions
// let tracker = 0

// ? FOR FUTURE:  somehow instantiate outside so it doesn't hvae to be instantiated every time, every call
// const globalCoreToDev = new CoreToDev({
//   pulseDev: pulseDevDb,
//   pulseCore: pulseCoreDb,
// })

const importPayerHistoricalAccessData = async (
  {
    wb, // TODO: will probably be used for string going into import feedback
    sheet: sheetName,
    data,
    timestamp,
    projectId,
  },
  { pulseCoreDb, pulseDevDb, mongoClient },
  importFeedback, // TODO: add success messages to importFeedback array on success (mutate this array)
) => {
  const isQualityAccessSheet = getIsQualityAccessSheet(sheetName)
  const isAdditionalCriteriaSheet = getIsAdditionalCriteriaSheet(sheetName)
  const isPolicyLinksSheet = getIsPolicyLinksSheet(sheetName)

  const validatorConfig = {
    sheetData: data,
    projectId,
    pulseCore: pulseCoreDb,
  }

  const projectConfig = {
    ...validatorConfig,
    sheetName,
    timestamp
  }

  const sheetValidator = new Validator(validatorConfig)
  await sheetValidator.validateAdditionalCriteria()
  // const sheetManager = new SheetToCore(projectConfig).getManager(sheetName)

  // if (isQualityAccessSheet) {
  //   await sheetValidator.validateQualityOfAccess()
  // } else if (isAdditionalCriteriaSheet) {
  //   await sheetValidator.validateAdditionalCriteria()
  // } else if (isPolicyLinksSheet) {
  //   await sheetValidator.validatePolicyLinks()
  // }

  // await sheetManager.upsertOrgTpHistory()

  // // ? TODO: Matt builds up success string and adds memoized importFeedback array

  // // ? let successString = `${wb}/${sheet} successfully updated in CORE DB for ${timestamp}`

  // const coreToDev = new CoreToDev({
  //   pulseDev: pulseDevDb,
  //   pulseCore: pulseCoreDb,
  // })

  // await coreToDev.materializeNonLivesCollections()


  // ? successString += 'successfully materialized data in DEV DB \n'
  // importFeedback.push(successString)

  /* ? IDEA FOR FUTURE: ISOLATE WHAT'S MATERIALIZED BASED ON WHAT'S INCOMING

  const coreToDev = globalCoreToDev

  if (sheet === 'qoa') {
    await coreToDev.materializeQoa()
    tracker++
  } else if (sheet === 'addl criteria') {
    await coreToDev.materializeAddlCriteria()
    tracker++
  } else if (sheet === 'policy links') {
    await coreToDev.materializePolicyLinks()
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
  await coreToDev.materializeCombinedNonLivesData()
  await coreToDev.materializeRegionalTargetingData()
}

*/

module.exports = importPayerHistoricalAccessData
