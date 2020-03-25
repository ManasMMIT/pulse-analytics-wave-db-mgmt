const ProjectHistoryManager = require('./ProjectHistoryManager')

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
  importFeedback, // TODO: add success messages to importFeedback array on success
) => {
  if (
    ![
      'Quality of Access',
      'Policy Links',
      // 'Additional Criteria',
    ].includes(sheet)
  ) {
    throw Error('Payer data import only accepts "Quality of Access" and "Policy Links" right now')
  }

  const projectHistoryManager = new ProjectHistoryManager({
    projectId,
    pulseCore: pulseCoreDb,
  })

  try {
    await projectHistoryManager.validate({
      sheetData: data,
      sheetName: sheet,
    })
  } catch(e) {
    throw new Error(e)
    // throw new Error(e.message + '\n' + 'Successful stuff:' + importFeedback.join('\n'))
  }

  // await projectHistoryManager
  //   .upsertOrgTpHistory({
  //     sheetData: data,
  //     sheetName: sheet,
  //     timestamp,
  //   })

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
