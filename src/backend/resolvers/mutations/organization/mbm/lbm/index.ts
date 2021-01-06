import createLbmOrganization from './create'
import updateLbmOrganization from './update'
import deleteLbmOrganization from './delete'

import lbmTypeResolvers from './type'
import lbmRelationalResolvers from './relational-resolvers'
import lbmServiceCategoryResolvers from './serviceCategory'
import lbmServiceResolvers from './service'

export default {
  createLbmOrganization,
  updateLbmOrganization,
  deleteLbmOrganization,
  ...lbmTypeResolvers,
  ...lbmRelationalResolvers,
  ...lbmServiceCategoryResolvers,
  ...lbmServiceResolvers,
}
