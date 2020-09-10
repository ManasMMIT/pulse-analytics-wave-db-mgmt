const pushDevToProdTypeDefs = require('./pushDevToProd')
const updateDevToProdTypeDef = require('./update')
const deleteDevToProdTypeDef = require('./delete')

module.exports = [
  pushDevToProdTypeDefs,
  updateDevToProdTypeDef,
  deleteDevToProdTypeDef,
]
