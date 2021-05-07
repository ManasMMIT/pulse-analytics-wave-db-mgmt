import createMarketBasketTypeDefs from './create'
import updateMarketBasketTypeDefs from './update'
import deleteMarketBasketTypeDefs from './delete'
import categoryTypeDefs from './category'
import characteristicTypeDefs from './characteristic'

export default [
  createMarketBasketTypeDefs,
  updateMarketBasketTypeDefs,
  deleteMarketBasketTypeDefs,
  ...categoryTypeDefs,
  ...characteristicTypeDefs,
]
