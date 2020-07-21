const { zonedTimeToUtc } = require('date-fns-tz')
const DEFAULT_TIMEZONE = require('../../../utils/defaultTimeZone')
const { STATE_LONG_BY_ABBREV } = require('../../../../utils/states-data-util')

const runOldPipeline = require('./runOldPipeline')
const runNewPipeline = () => {}

const importPayerHistoricalLivesData = async ({
  sheetObj,
  dbsConfig,
  importFeedback,
}) => {
  let { timestamp, territoryType, source, data } = sheetObj

  timestamp = zonedTimeToUtc(timestamp, DEFAULT_TIMEZONE)

  // ! Don't trust state lives sheets to correctly pair state abbrev. w/ stateLong
  if (territoryType === 'U.S. State') {
    data.forEach((row) => {
      if (row.stateLong !== STATE_LONG_BY_ABBREV[row.state]) {
        console.error(
          `WARNING: Sheet's stateLong '${row.stateLong}' doesn't match state '${row.state}'`
        )
        row.stateLong = STATE_LONG_BY_ABBREV[row.state]
      }
    })
  }

  const pipelineInput = {
    timestamp,
    territoryType,
    source,
    data,
    dbsConfig,
  }

  await Promise.all([
    runOldPipeline(pipelineInput),
    runNewPipeline(pipelineInput),
  ])
}

module.exports = importPayerHistoricalLivesData
