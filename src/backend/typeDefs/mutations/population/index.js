const createPopulationTypeDefs = require('./create')
const deletePopulationTypeDefs = require('./delete')
const updatePopulationTypeDefs = require('./update')

module.exports = [
  createPopulationTypeDefs,
  deletePopulationTypeDefs,
  updatePopulationTypeDefs,
]
