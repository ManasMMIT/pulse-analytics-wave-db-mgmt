import marketBasketResolvers from './marketBasket'
import vegaClientTeamRegionResolvers from './region'

export default {
  ...marketBasketResolvers,
  ...vegaClientTeamRegionResolvers,
}
