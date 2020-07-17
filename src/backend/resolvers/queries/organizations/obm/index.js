const obmOrganizations = require('./obm')
const obmServices = require('./service')
const obmServicesCategories = require('./serviceCategory')
const joins = require('./joins')
const views = require('./views')

module.exports = {
  obmServices,
  obmOrganizations,
  obmServicesCategories,
  ...joins,
  ...views,
}
