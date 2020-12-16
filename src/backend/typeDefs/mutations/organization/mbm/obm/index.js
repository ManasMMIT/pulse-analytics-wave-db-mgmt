const createObmOrganizationTypeDefs = require('./create')
const updateObmOrganizationTypeDefs = require('./update')
const deleteObmOrganizationTypeDefs = require('./delete')

const obmServiceTypeDefs = require('./service')
const obmServiceCategoryTypeDefs = require('./serviceCategory')
const obmTypeTypeDefs = require('./type')
const obmRelationalTypeDefs = require('./relational-typeDefs')

module.exports = [
  createObmOrganizationTypeDefs,
  updateObmOrganizationTypeDefs,
  deleteObmOrganizationTypeDefs,
  ...obmServiceTypeDefs,
  ...obmServiceCategoryTypeDefs,
  ...obmTypeTypeDefs,
  ...obmRelationalTypeDefs,
]
