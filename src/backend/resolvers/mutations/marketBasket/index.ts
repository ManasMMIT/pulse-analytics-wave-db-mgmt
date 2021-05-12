import createMarketBasket from './create'
import updateMarketBasket from './update'
import deleteMarketBasket from './delete'
import categoryMutations from './category'
import characteristicMutations from './characteristic'
import pushMarketBasketsToDev from './pushToDev'

export default {
  createMarketBasket,
  updateMarketBasket,
  deleteMarketBasket,
  ...categoryMutations,
  ...characteristicMutations,
  pushMarketBasketsToDev,
}
