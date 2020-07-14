const updatePayerProjectPtpsTypeDefs = require('./updatePtps')
const removePayerProjectPtpsTypeDefs = require('./removePtps')
const transferPayerProjectPtpsTypeDefs = require('./transferPtps')
const createPayerProjectTypeDefs = require('./create')
const deletePayerProjectTypeDefs = require('./delete')
const updatePayerProjectNameTypeDefs = require('./updateProjectName')

module.exports = [
  updatePayerProjectPtpsTypeDefs,
  removePayerProjectPtpsTypeDefs,
  transferPayerProjectPtpsTypeDefs,
  createPayerProjectTypeDefs,
  deletePayerProjectTypeDefs,
  updatePayerProjectNameTypeDefs,
]
