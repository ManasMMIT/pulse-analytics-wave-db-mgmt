import createMarketBasketTypeDefs from './create'
import updateMarketBasketTypeDefs from './update'
import deleteMarketBasketTypeDefs from './delete'
import categoryTypeDefs from './category'
import characteristicTypeDefs from './characteristic'
import pushMarketBasketsToDevTypeDefs from './pushToDev'
import importSurveyTypeDefs from './importSurvey'

export default [
  importSurveyTypeDefs,
  pushMarketBasketsToDevTypeDefs,
  createMarketBasketTypeDefs,
  updateMarketBasketTypeDefs,
  deleteMarketBasketTypeDefs,
  ...categoryTypeDefs,
  ...characteristicTypeDefs,
]
