const createObmOrganization = require('./create')
const updateObmOrganization = require('./update/resolver')
const deleteObmOrganization = require('./delete')

const obmServiceResolvers = require('./service')
const obmServiceCategoryResolvers = require('./serviceCategory')
const obmTypeResolvers = require('./type')
const obmRelationalResolvers = require('./relational-resolvers')

module.exports = {
  createObmOrganization,
  updateObmOrganization,
  deleteObmOrganization,
  ...obmServiceResolvers,
  ...obmServiceCategoryResolvers,
  ...obmTypeResolvers,
  ...obmRelationalResolvers,
}
