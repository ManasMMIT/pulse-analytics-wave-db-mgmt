import serviceAndServiceCategoryTypeDefs from './serviceAndServiceCategory'
import lbmAndServiceTypeDefs from './lbmAndService'
import lbmAndLbmTypeTypeDefs from './lbmAndLbmType'
// import lbmAndPersonTypeDefs from './lbmAndPerson'
import lbmAndKeyEvent from './lbmAndKeyEvent'
import lbmAndPayer from './lbmAndPayer'

export default [
  ...serviceAndServiceCategoryTypeDefs,
  ...lbmAndServiceTypeDefs,
  ...lbmAndLbmTypeTypeDefs,
  // ...lbmAndPersonTypeDefs,
  ...lbmAndKeyEvent,
  ...lbmAndPayer,
]
