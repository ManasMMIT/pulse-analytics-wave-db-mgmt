const _ = require('lodash')

const clients = require('./clients')
const teams = require('./teams')
const users = require('./users')
const nodes = require('./nodes')
const indications = require('./indications')

module.exports = {
  clients,
  teams,
  users,
  nodes,
  indications,
}
