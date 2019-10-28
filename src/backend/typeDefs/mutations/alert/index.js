const emailAlertsTypeDefs = require('./email')
const createEmailUsersTypeDefs = require('./create')
const deleteEmailUsersTypeDefs = require('./delete')

module.exports = [
  emailAlertsTypeDefs,
  createEmailUsersTypeDefs,
  deleteEmailUsersTypeDefs,
]
