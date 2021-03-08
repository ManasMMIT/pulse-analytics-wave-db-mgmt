const connectToMongoDb = require('./../../../connect-to-mongodb')

const one_resetVegaTableData = require('./1-reset-vega-table-data')
const two_seedObmsAndAddUuids = require('./2-seed-obms-and-add-uuids')
const three_seedServicesWithCategories = require('./3-seed-services-with-categories')

require('./../../../src/backend/auth0/vegaClient')
console.log('Instantiate VegaClient singleton and set axios global settings')

const migrateToVega = async () => {
  const dbs = await connectToMongoDb()

  console.log(`Starting Vega Migration\n`)

  await one_resetVegaTableData()
  await two_seedObmsAndAddUuids(dbs)
  await three_seedServicesWithCategories(dbs)

  console.log('Current Vega Migration Completed')
  dbs.close()
}

migrateToVega()
