const pushOps = require('./push')
const updateRoleSitemap = require('./update')
const updateTdgTimestamps = require('./updateTdgTimestamps')

module.exports = {
  ...pushOps,
  updateRoleSitemap,
  updateTdgTimestamps,
}
