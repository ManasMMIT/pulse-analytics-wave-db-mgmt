const ProjectHistoryManager = require('../utils/ProjectHistoryManager')

// const PayerHistoryManager = require('../utils/PayerHistoryManager')

const importHistoricalProjectData = async (
  parent,
  {
    input: {
      wb,
      sheet,
      data,
      date,
      projectId,
    }
  },
  { pulseCoreDb, pulseDevDb },
  info,
) => {
  const projectHistoryManager = new ProjectHistoryManager({
    projectId,
    pulseCore: pulseCoreDb,
  })

  await projectHistoryManager
    .upsertOrgTpHistory({
      sheetData: data,
      sheetName: sheet,
      date,
    })

  // const payerHistoryManager = new PayerHistoryManager({
  //   pulseDev: pulseDevDb,
  //   pulseCore: pulseCoreDb,
  // })

  // await payerHistoryManager.materializeNonLivesCollections()

  return 'Success'
}

module.exports = importHistoricalProjectData
