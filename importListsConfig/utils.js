const path = require('path')

const validateFileName = filePath => {
  // select the fileName at the end of the filePath
  const fileName = path.basename(filePath)

  const matchResult = fileName.match(/^listsConfig_([A-Za-z]+_[A-Za-z-]+)\.json$/)

  if (!matchResult) {
    console.error('File name is not valid')
    process.exit()
  }

  // select the regex capture group from the match result, which should be in
  // the format `${dashboard}_${tool}`, i.e. `provider_sickle-cell`
  const dashboardTool = matchResult[1]
  console.log(`Key for 'dashboardTool' set to '${dashboardTool}'`)

  return dashboardTool
}

const addDashboardToolAndTimestampToData = (data, dashboardTool) => {
  const createdOn = new Date()
  return data.map(listConfigObj => ({ ...listConfigObj, dashboardTool, createdOn }))
}

module.exports = {
  validateFileName,
  addDashboardToolAndTimestampToData
}
