const createTeamTypeDefs = require('./create')
const updateTeamTypeDefs = require('./update')
const updatePermissionsTypeDefs = require('./update-permissions')
const deleteTeamTypeDefs = require('./delete')
const updateTeamNodeTypeDefs = require('./updateNode')

module.exports = [
  createTeamTypeDefs,
  updateTeamTypeDefs,
  deleteTeamTypeDefs,
  updatePermissionsTypeDefs,
  updateTeamNodeTypeDefs,
]
