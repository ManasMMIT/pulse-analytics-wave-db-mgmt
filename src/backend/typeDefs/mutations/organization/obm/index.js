const createObmOrganizationTypeDefs = require('./create')
const updateObmOrganizationTypeDefs = require('./update')

const obmServiceTypeDefs = require('./service')
const obmServiceCategoryTypeDefs = require('./serviceCategory')

module.exports = [
  createObmOrganizationTypeDefs,
  updateObmOrganizationTypeDefs,
  ...obmServiceTypeDefs,
  ...obmServiceCategoryTypeDefs,
]
