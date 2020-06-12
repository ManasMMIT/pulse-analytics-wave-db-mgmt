const createObmOrganization = require('./create')
const updateObmOrganization = require('./update')

const obmServiceResolvers = require('./service')
const obmServiceCategoryResolvers = require('./serviceCategory')
const obmRelationalResolvers = require('./relational-resolvers')

module.exports = {
  createObmOrganization,
  updateObmOrganization,
  ...obmServiceResolvers,
  ...obmServiceCategoryResolvers,
  ...obmRelationalResolvers,
}
