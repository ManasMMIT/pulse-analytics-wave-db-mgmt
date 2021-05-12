import createMarketBasketTypeDefs from './create'
import updateMarketBasketTypeDefs from './update'
import deleteMarketBasketTypeDefs from './delete'
import categoryTypeDefs from './category'
import characteristicTypeDefs from './characteristic'
import pushMarketBasketsToDevTypeDefs from './pushToDev'


export default [
  pushMarketBasketsToDevTypeDefs,
  createMarketBasketTypeDefs,
  updateMarketBasketTypeDefs,
  deleteMarketBasketTypeDefs,
  ...categoryTypeDefs,
  ...characteristicTypeDefs,
]
