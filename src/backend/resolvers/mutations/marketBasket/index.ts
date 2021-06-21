import createMarketBasket from './create'
import updateMarketBasket from './update'
import deleteMarketBasket from './delete'
import categoryMutations from './category'
import characteristicMutations from './characteristic'
import surveyMutations from './survey'
import pushMarketBasketsToDev from './pushToDev'
import importMarketBasketSurvey from './importSurvey'

export default {
  createMarketBasket,
  updateMarketBasket,
  deleteMarketBasket,
  ...categoryMutations,
  ...characteristicMutations,
  ...surveyMutations,
  pushMarketBasketsToDev,
  importMarketBasketSurvey,
}
