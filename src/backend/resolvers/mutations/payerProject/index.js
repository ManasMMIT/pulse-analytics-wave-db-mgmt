const updatePayerProjectPtps = require('./updatePtps')
const removePayerProjectPtps = require('./removePtps')
const transferPayerProjectPtps = require('./transferPtps')
const createPayerProject = require('./create')
const deletePayerProject = require('./delete')
const updatePayerProjectName = require('./updateProjectName')

module.exports = {
  updatePayerProjectPtps,
  removePayerProjectPtps,
  transferPayerProjectPtps,
  createPayerProject,
  deletePayerProject,
  updatePayerProjectName,
}
