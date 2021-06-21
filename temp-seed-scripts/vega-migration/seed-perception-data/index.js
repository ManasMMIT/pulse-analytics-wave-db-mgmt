const connectToMongoDb = require('./../../../connect-to-mongodb')

console.log('Instantiate VegaClient singleton and set axios global settings')
require('./../../../src/backend/auth0/vegaClient')

const zero_resetPerceptionData = require('./zero_resetPerceptionData')
const one_IndRegProdSteps = require('./one_IndRegProdSteps')
const two_clientTeamSteps = require('./two_clientTeamSteps')
const three_seedPeople = require('./three_seedPeople')
const four_seedStates = require('./four_seedStates')
const five_seedProviders = require('./five_seedProviders')

/*
  Migration steps:
    0. Delete all relevant data from vega
    1. Ind-Reg-Prod Steps
      a. Seed Regimens
      b. Seed Products and seed ProdReg join table through pulse-core.regimens collection
      c. Seed Indicsations and Seed IndReg connections through pulse-core.regimens collection
    2. Client-Team Steps
      a. Seed Clients
      b. Seed Teams w/ client foreign keys
*/

const migrateToVega = async () => {
  const dbs = await connectToMongoDb()

  console.log(`Starting Perception Tool Vega Migration\n`)

  // await zero_resetPerceptionData()
  // await one_IndRegProdSteps(dbs)
  // await two_clientTeamSteps(dbs)
  // await three_seedPeople(dbs)
  // await four_seedStates(dbs)

  await five_seedProviders(dbs)

  console.log('Perception Tool Vega Migration Completed')
  dbs.close()
}

migrateToVega()
