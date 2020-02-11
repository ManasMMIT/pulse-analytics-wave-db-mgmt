const createUserTypeDefs = require('./create')
const updateUserTypeDefs = require('./update')
const deleteUserTypeDefs = require('./delete')

module.exports = [
  createUserTypeDefs,
  updateUserTypeDefs,
  deleteUserTypeDefs,
]
