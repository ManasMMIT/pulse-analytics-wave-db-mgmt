const createTeam = require('./create')
const updateTeam = require('./update')
const updatePermissions = require('./updatePermissions')
const deleteTeam = require('./delete')

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  updatePermissions,
}
