const pathwaysOrganizations = require('./pathways')
const joins = require('./joins')

module.exports = {
  pathwaysOrganizations,
  ...joins,
}
