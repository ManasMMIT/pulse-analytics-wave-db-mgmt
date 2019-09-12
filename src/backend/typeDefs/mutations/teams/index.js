const createTeamTypeDefs = require('./create')
const updateTeamTypeDefs = require('./update')
const deleteTeamTypeDefs = require('./delete')

module.exports = [
  createTeamTypeDefs,
  updateTeamTypeDefs,
  deleteTeamTypeDefs,
]
