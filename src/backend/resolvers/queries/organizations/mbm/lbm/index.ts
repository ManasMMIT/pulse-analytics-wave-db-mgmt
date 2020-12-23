import lbmOrganizations from './lbm'
import lbmServices from './service'
import lbmServicesCategories from './serviceCategory'
import lbmTypes from './type'
// import lbmKeyEvents from './keyEvents'
import joins from './joins'
import views from './views'

export default {
  lbmOrganizations,
  lbmTypes,
  lbmServicesCategories,
  lbmServices,
  ...joins,
  ...views,
}
