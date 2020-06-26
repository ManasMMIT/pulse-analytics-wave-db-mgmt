const createPersonTypeDefs = require('./create')
const updatePersonTypeDefs = require('./update')
const deletePersonTypeDefs = require('./delete')

module.exports = [
  createPersonTypeDefs,
  deletePersonTypeDefs,
  updatePersonTypeDefs,
]
