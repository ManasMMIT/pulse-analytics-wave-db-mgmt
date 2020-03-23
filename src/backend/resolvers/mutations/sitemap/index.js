const pushOps = require('./push')
const updateRoleSitemap = require('./update')
const createSourceNode = require('./createSourceNode')

module.exports = {
  ...pushOps,
  updateRoleSitemap,
  createSourceNode,
}
