const createObmOrganizationTypeDefs = require('./create')
const updateObmOrganizationTypeDefs = require('./update')

const obmServiceTypeDefs = require('./service')
const obmServiceCategoryTypeDefs = require('./serviceCategory')
const obmRelationalTypeDefs = require('./relational-typeDefs')

module.exports = [
  createObmOrganizationTypeDefs,
  updateObmOrganizationTypeDefs,
  ...obmServiceTypeDefs,
  ...obmServiceCategoryTypeDefs,
  ...obmRelationalTypeDefs,
]
