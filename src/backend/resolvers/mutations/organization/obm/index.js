const createObmOrganization = require('./create')
const updateObmOrganization = require('./update')

const obmServiceResolvers = require('./service')
const obmServiceCategoryResolvers = require('./serviceCategory')

module.exports = {
  createObmOrganization,
  updateObmOrganization,
  ...obmServiceResolvers,
  ...obmServiceCategoryResolvers,
}
