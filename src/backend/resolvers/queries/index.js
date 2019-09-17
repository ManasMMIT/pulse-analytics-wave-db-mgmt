const _ = require('lodash')

const clients = require('./clients')
const teams = require('./teams')
const users = require('./users')
const nodes = require('./nodes')
const indications = require('./indications')
const products = require('./products')
const regimens = require('./regimens')
const qualityOfAccessScores = require('./qualityOfAccessScores')

module.exports = {
  clients,
  teams,
  users,
  nodes,
  indications,
  products,
  regimens,
  qualityOfAccessScores,
}
