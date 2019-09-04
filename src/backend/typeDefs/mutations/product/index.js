const createProductTypeDefs = require('./create')
const updateSourceProductTypeDefs = require('./update')
const deleteSourceProductTypeDefs = require('./delete')

module.exports = [
  createProductTypeDefs,
  updateSourceProductTypeDefs,
  deleteSourceProductTypeDefs,
]
