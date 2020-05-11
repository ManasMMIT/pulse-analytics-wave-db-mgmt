const createCoverageTypeDefs = require('./create')
const deleteCoverageTypeDefs = require('./delete')
const updateCoverageTypeDefs = require('./update')

module.exports = [
  createCoverageTypeDefs,
  deleteCoverageTypeDefs,
  updateCoverageTypeDefs,
]
