const obmOrganizations = require('./obm')
const obmServices = require('./service')
const obmServicesCategories = require('./serviceCategory')
const obmTypes = require('./type')
const obmKeyEvents = require('./keyEvents')
const joins = require('./joins')
const views = require('./views')

module.exports = {
  obmServices,
  obmOrganizations,
  obmServicesCategories,
  obmTypes,
  obmKeyEvents,
  ...joins,
  ...views,
}
