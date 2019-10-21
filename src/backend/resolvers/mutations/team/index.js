const createTeam = require('./create')
const updateTeam = require('./update')
const updatePermissions = require('./update-permissions')
const deleteTeam = require('./delete')

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  updatePermissions,
}
