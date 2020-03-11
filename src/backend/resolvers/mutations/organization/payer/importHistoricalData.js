const HistoricalProject = require('../utils/HistoricalProject')

const importHistoricalData = async (
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
  { pulseCoreDb },
  info,
) => {
  const historicalProject = new HistoricalProject(projectId)

  return await historicalProject.update({
    db: pulseCoreDb,
    sheetData: data,
    sheetName: sheet,
    date,
  })
}

module.exports = importHistoricalData
