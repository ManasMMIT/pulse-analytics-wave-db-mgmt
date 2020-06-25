const obmOrganizations = require('./obm')
const obmServices = require('./service')
const obmServicesCategories = require('./serviceCategory')
const obmServiceAndObmServiceCategoryConnections = require('./serviceAndServiceCategory')
const obmAndObmServiceConnections = require('./obmAndService')
const obmAndPersonConnections = require('./obmAndPerson')
const templates = require('./templates')
const obmAndPayerConnections = require('./obmAndPayer')

module.exports = {
  obmServices,
  obmOrganizations,
  obmServicesCategories,
  obmServiceAndObmServiceCategoryConnections,
  obmAndObmServiceConnections,
  obmAndPersonConnections,
  ...templates,
  obmAndPayerConnections,
}
