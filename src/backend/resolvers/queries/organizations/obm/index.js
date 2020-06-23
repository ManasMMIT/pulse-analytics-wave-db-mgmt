const obmOrganizations = require('./obm')
const obmServices = require('./service')
const obmServicesCategories = require('./serviceCategory')
const obmServiceAndObmServiceCategoryConnections = require('./serviceAndServiceCategory')
const obmAndObmServiceConnections = require('./obmAndService')
const obmAndPersonConnections = require('./obmAndPerson')
const obmAndPayerConnections = require('./obmAndPayer')
const serviceTemplateObms = require('./serviceTemplate')

module.exports = {
  obmServices,
  obmOrganizations,
  obmServicesCategories,
  obmServiceAndObmServiceCategoryConnections,
  obmAndObmServiceConnections,
  obmAndPersonConnections,
  obmAndPayerConnections,
  serviceTemplateObms,
}
