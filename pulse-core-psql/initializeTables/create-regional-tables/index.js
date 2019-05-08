const fs = require('fs')
let args = require('yargs')
const connectToPsql = require('../../connect-to-psql')
const csvToJson = require('./csv-to-json')
const { getScriptTerminator } = require('../../../utils')
const { STATES_MAP, STATE_CODE_MAP } = require('./states-util')

args = args.usage('Usage: $0 --filepath [string]').argv

const filepath = args.filepath

if (filepath) {
  const fileExists = filepath => {
    try {
      return fs.statSync(filepath).isFile()
    } catch (err) {
      console.error(err)
      return false
    }
  }

  if (fileExists(filepath)) {
    const executeRegionalSeeding = async () => {
      const sequelize = await connectToPsql()
      await createRegionalTables({ sequelize, shouldSeed: false })
    }

    executeRegionalSeeding()
  } else {
    console.error('File does not exist.')
    process.exit()
  }
} else {
  console.error('No filepath specified: ignore if not importing CSV')
}

async function createRegionalTables({ sequelize, shouldSeed }) {
  const UsState = await sequelize.import('us_state', require('../models/us_state'))
  const Region = await sequelize.import('region', require('../models/region'))
  const RegionalBreakdown = await sequelize.import(
    'regional_breakdown',
    require('../models/regional_breakdown')
  )

  UsState.belongsToMany(Region, { through: 'us_states_regions', otherKey: 'stateId' })
  Region.belongsToMany(UsState, { through: 'us_states_regions' })

  const UsStateRegion = await sequelize.import(
    'us_states_regions',
    require('../models/us_states_regions'),
  )

  UsStateRegion.belongsToMany(
    RegionalBreakdown,
    {
      through: 'regional_breakdowns_us_states_regions',
      foreignKey: 'us_state_region_id',
      otherKey: 'regional_breakdown_id',
      as: 'bsr',
    },
  )

  RegionalBreakdown.belongsToMany(
    UsStateRegion,
    {
      through: 'regional_breakdowns_us_states_regions',
      foreignKey: 'regional_breakdown_id',
      otherKey: 'us_state_region_id',
      as: 'bsr',
    },
  )

  const BreakdownStateRegion = await sequelize.import(
    'regional_breakdowns_us_states_regions',
    require('../models/regional_breakdowns_us_states_regions'),
  )

  if (shouldSeed) {
    const terminateScript = getScriptTerminator(sequelize)

    const Models = [UsState, Region, UsStateRegion, RegionalBreakdown, BreakdownStateRegion]
    for (const Model of Models) { await Model.sync({ force: true }) }
    const rawClientRegionsData = await csvToJson(filepath).catch(terminateScript)

    for (const datum of rawClientRegionsData) {
      const { user, role, content, region, state } = datum

      const currentUsState = await UsState.findOrCreate({
        where: {
          id: STATE_CODE_MAP[state],
          state,
          stateLong: STATES_MAP[state] || state
        },
      }).then(arr => arr[0])

      const currentRegion = await Region.findOrCreate({
        where: { name: region },
      }).then(arr => arr[0])

      const currentUsStateRegion = await UsStateRegion.findOrCreate({
        where: {
          stateId: currentUsState.id,
          regionId: currentRegion.id,
        },
      }).then(arr => arr[0])

      const currentRegionalBreakdown = await RegionalBreakdown.findOrCreate({
        where: { name: user },
      }).then(arr => arr[0])

      await BreakdownStateRegion.findOrCreate({
        where: {
          regional_breakdown_id: currentRegionalBreakdown.id,
          us_state_region_id: currentUsStateRegion.id,
        },
      }).then(arr => arr[0])
    }
  }

  return RegionalBreakdown
}

module.exports = createRegionalTables
