const createObmOrganizationTypeDefs = require('./create')
const updateObmOrganizationTypeDefs = require('./update')

const obmServiceTypeDefs = require('./service')
const obmServiceCategoryTypeDefs = require('./serviceCategory')
const obmTypeTypeDefs = require('./type')
const obmRelationalTypeDefs = require('./relational-typeDefs')

module.exports = [
  createObmOrganizationTypeDefs,
  updateObmOrganizationTypeDefs,
  ...obmServiceTypeDefs,
  ...obmServiceCategoryTypeDefs,
  ...obmTypeTypeDefs,
  ...obmRelationalTypeDefs,
]
