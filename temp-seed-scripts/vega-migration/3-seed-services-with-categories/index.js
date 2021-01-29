/*
  PLAN:
  1. seed service categories
    a. build map of uuid to objectid during seed
  2. seed services
    a. use aggregate service with category as objectid from join table, using the oid to get the uuid from step 1 map
    b. build map of objectid to uuid
  3. seed ObmObmService join table
    a. use aggregate join table with obm.uuid
    b. use 2.b map to swap obmServiceId in join table
*/

const a_seedServiceCatsWithMapOutput = require('./a_seedServiceCatsWithMapOutput')
const b_seedServicesWithMapOutput = require('./b_seedServicesWithMapOutput')
const c_seedObmServConnections = require('./c_seedObmServConnections')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')

  const obmServiceCatIdsMap = await a_seedServiceCatsWithMapOutput(pulseCoreDb)
  const obmServiceIdsMap = await b_seedServicesWithMapOutput(pulseCoreDb, obmServiceCatIdsMap)
  await c_seedObmServConnections(pulseCoreDb, obmServiceIdsMap)
}
