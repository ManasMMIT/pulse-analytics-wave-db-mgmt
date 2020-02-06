const createClientTypeDefs = require('./create')
const deleteClientTypeDefs = require('./delete')
const updateClientTypeDefs = require('./update')

module.exports = [
  createClientTypeDefs,
  deleteClientTypeDefs,
  updateClientTypeDefs,
]
