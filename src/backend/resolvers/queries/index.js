const _ = require('lodash')

const clients = require('./clients')
const teams = require('./teams')
const users = require('./users')
const nodes = require('./nodes')
const indications = require('./indications')
const products = require('./products')
const regimens = require('./regimens')
const qualityAccessScores = require('./qualityAccessScores')

module.exports = {
  clients,
  teams,
  users,
  nodes,
  indications,
  products,
  regimens,
  qualityAccessScores,
}
