const createBookTypeDefs = require('./create')
const deleteBookTypeDefs = require('./delete')
const updateBookTypeDefs = require('./update')

module.exports = [
  createBookTypeDefs,
  deleteBookTypeDefs,
  updateBookTypeDefs,
]
