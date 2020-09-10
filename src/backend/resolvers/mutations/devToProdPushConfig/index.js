const pushDevToProd = require('./pushDevToProd')
const createDevToProdPushConfig = require('./create')
const updateDevToProdPushConfig = require('./update')
const deleteDevToProdPushConfig = require('./delete')

module.exports = {
  pushDevToProd,
  createDevToProdPushConfig,
  updateDevToProdPushConfig,
  deleteDevToProdPushConfig,
}
