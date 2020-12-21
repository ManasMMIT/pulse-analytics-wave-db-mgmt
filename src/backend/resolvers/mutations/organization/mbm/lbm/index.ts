import createLbmOrganization from './create'
import updateLbmOrganization from './update'
import deleteLbmOrganization from './delete'
import lbmTypeResolvers from './type'
import lbmRelationalResolvers from './relational-resolvers'

export default {
  createLbmOrganization,
  updateLbmOrganization,
  deleteLbmOrganization,
  ...lbmTypeResolvers,
  ...lbmRelationalResolvers,
}
