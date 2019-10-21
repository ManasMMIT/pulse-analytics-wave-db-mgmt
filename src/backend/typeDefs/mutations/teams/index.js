const createTeamTypeDefs = require('./create')
const updateTeamTypeDefs = require('./update')
const updatePermissionsTypeDefs = require('./update-permissions')
const deleteTeamTypeDefs = require('./delete')

module.exports = [
  createTeamTypeDefs,
  updateTeamTypeDefs,
  deleteTeamTypeDefs,
  updatePermissionsTypeDefs,
]
