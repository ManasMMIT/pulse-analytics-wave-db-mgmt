import getUpdateSurveyDataCatCharOps from './getUpdateSurveyDataCatCharOps'
import getUpdateSurveyDataProductRegimenOps from './getUpdateSurveyDataProductRegimenOps'

const updateSingleMarketBasketSurveyData = async (marketBasket, pulseDevDb) => {
  const {
    updateSurveyDataCategoryOps,
    updateSurveyDataCharacteristicOps,
  } = getUpdateSurveyDataCatCharOps(marketBasket, pulseDevDb)

  const productRegimenOps = getUpdateSurveyDataProductRegimenOps(marketBasket, pulseDevDb)

  await Promise.all([
    ...updateSurveyDataCategoryOps,
    ...updateSurveyDataCharacteristicOps,
    ...productRegimenOps,
  ])
}

export default updateSingleMarketBasketSurveyData
