const { zonedTimeToUtc } = require('date-fns-tz')
const DEFAULT_TIMEZONE = require('../../../../utils/defaultTimeZone')
const { STATE_LONG_BY_ABBREV } = require('../../../../utils/states-data-util')

const runOldPipeline = require('./runOldPipeline')
const runNewPipeline = require('./runNewPipeline')

const KEYS_TO_SKIP_ZEROING = {
  state: true,
  stateLong: true,
  organization: true,
  organizationTiny: true,
  slug: true,
}

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

  // ! HOTFIX expensive and inexact overwriting of lives fields from null to 0
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key in KEYS_TO_SKIP_ZEROING) return

      if (row[key] === null) row[key] = 0
    })
  })

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
