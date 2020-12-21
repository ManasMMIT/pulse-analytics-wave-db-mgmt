import createLbmOrganizationTypeDefs from './create'
import updateLbmOrganizationTypeDefs from './update'
import deleteLbmOrganizationTypeDefs from './delete'

// import lbmServiceTypeDefs from './service'
// import lbmServiceCategoryTypeDefs from './serviceCategory'
import lbmTypeTypeDefs from './type'
import lbmRelationalTypeDefs from './relational-typeDefs'

export default [
  createLbmOrganizationTypeDefs,
  updateLbmOrganizationTypeDefs,
  deleteLbmOrganizationTypeDefs,
  // ...lbmServiceTypeDefs,
  // ...lbmServiceCategoryTypeDefs,
  ...lbmTypeTypeDefs,
  ...lbmRelationalTypeDefs,
]
