import serviceAndServiceCategoryResolvers from './serviceAndServiceCategory'
import lbmAndServiceResolvers from './lbmAndService'
import lbmAndPersonResolvers from './lbmAndPerson'
import lbmAndLbmTypeResolvers from './lbmAndLbmType'
import lbmAndKeyEventResolvers from './lbmAndKeyEvent'
import lbmAndPayer from './lbmAndPayer'

export default {
  ...serviceAndServiceCategoryResolvers,
  ...lbmAndServiceResolvers,
  ...lbmAndPersonResolvers,
  ...lbmAndLbmTypeResolvers,
  ...lbmAndKeyEventResolvers,
  ...lbmAndPayer,
}
