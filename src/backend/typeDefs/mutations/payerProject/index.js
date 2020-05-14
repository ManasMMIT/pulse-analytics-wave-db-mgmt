const updatePayerProjectPtpsTypeDefs = require('./updatePtps')
const removePayerProjectPtpsTypeDefs = require('./removePtps')
const transferPayerProjectPtpsTypeDefs = require('./transferPtps')
const createPayerProjectTypeDefs = require('./create')

module.exports = [
  updatePayerProjectPtpsTypeDefs,
  removePayerProjectPtpsTypeDefs,
  transferPayerProjectPtpsTypeDefs,
  createPayerProjectTypeDefs,
]
