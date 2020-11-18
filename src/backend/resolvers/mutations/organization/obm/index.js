const createObmOrganization = require('./create')
const updateObmOrganization = require('./update/resolver')

const obmServiceResolvers = require('./service')
const obmServiceCategoryResolvers = require('./serviceCategory')
const obmTypeResolvers = require('./type')
const obmRelationalResolvers = require('./relational-resolvers')

module.exports = {
  createObmOrganization,
  updateObmOrganization,
  ...obmServiceResolvers,
  ...obmServiceCategoryResolvers,
  ...obmTypeResolvers,
  ...obmRelationalResolvers,
}
