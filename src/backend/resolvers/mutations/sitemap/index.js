const pushOps = require('./push')
const updateRoleSitemap = require('./update')
const createSourceNode = require('./createSourceNode')
const updateTdgTimestamps = require('./updateTdgTimestamps')

module.exports = {
  ...pushOps,
  updateRoleSitemap,
  createSourceNode,
  updateTdgTimestamps,
}
