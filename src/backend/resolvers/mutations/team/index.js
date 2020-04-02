const createTeam = require('./create')
const updateTeam = require('./update')
const updatePermissions = require('./updatePermissions')
const deleteTeam = require('./delete')
const updateTeamNode = require('./updateNode')

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  updatePermissions,
  updateTeamNode,
}
