import obmResolvers from './obm'
import lbmResolvers from './lbm'
import mbmOrganizations from './mbmOrganizations'

module.exports = {
  ...obmResolvers,
  ...lbmResolvers,
  mbmOrganizations,
}
