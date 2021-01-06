import obmOrganizationResolvers from './obm'
import lbmOrganizationResolvers from './lbm'

module.exports = {
  ...obmOrganizationResolvers,
  ...lbmOrganizationResolvers,
}
