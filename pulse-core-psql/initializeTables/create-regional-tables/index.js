const fs = require('fs')
let args = require('yargs')
const connectToPsql = require('../../connect-to-psql')
const csvToJson = require('./csv-to-json')
const { getScriptTerminator } = require('../../../utils')

args = args.usage('Usage: $0 --filepath [string]')
  .demandOption(['filepath'])
  .argv

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
      debugger
      await createRegionalTables({ sequelize, shouldSeed: true })
    }

    executeRegionalSeeding()
  } else {
    console.error('File does not exist.')
    process.exit()
  }
} else {
  console.error('No filepath specified')
}

async function createRegionalTables({ sequelize, shouldSeed }) {
  const UsState = await sequelize.import('us_state', require('../models/us_state'))
  const Region = await sequelize.import('region', require('../models/region'))

  UsState.belongsToMany(Region, { through: 'us_state_regions' })
  Region.belongsToMany(UsState, { through: 'us_state_regions' })

  const UsStateRegion = sequelize.define('us_state_regions')
  debugger

  if (shouldSeed) {
    const terminateScript = getScriptTerminator(sequelize)

    const Models = [UsState, Region, UsStateRegion]
    for (const Model of Models) { await Model.sync({ force: true }) }
    const json = await csvToJson(filepath).catch(terminateScript)
    debugger


    // for (let i = 1; i < 25; i += 1) {
    //   const currentCard = await Card.create({ name: PAGE_CARD_MAP[i] })
    //   const currentPage = await Page.findByPk(i);
    //   await currentPage.addCard(currentCard)
    // }
  }

  return null
}

module.exports = createRegionalTables
