const pushDevToProd = require('./pushDevToProd')
const psqlPushCoreToProd = require('./psqlPushCoreToProd')
const createDevToProdPushConfig = require('./create')
const updateDevToProdPushConfig = require('./update')
const deleteDevToProdPushConfig = require('./delete')

module.exports = {
  psqlPushCoreToProd,
  pushDevToProd,
  createDevToProdPushConfig,
  updateDevToProdPushConfig,
  deleteDevToProdPushConfig,
}
