import _ from 'lodash'

const removeSingleMarketBasketSurveyData = async (marketBasket, pulseDevDb) => {
  let categoryIds = []
  let characteristicIds = []
  let productIds = []
  let regimenIds = []

  marketBasket.categories.forEach(({ id, characteristics }) => {
    categoryIds = [id, ...categoryIds]
    characteristicIds = [...characteristicIds, ...characteristics]
  })

  marketBasket.products_regimens.forEach(({
    product: { id: productId },
    regimen: { id: regimenId }
  }) => {
    productIds = [productId, ...productIds]
    regimenIds = [regimenId, ...regimenIds]
  })

  // ! delete answers where category or characteristic no longer exists on market basket
  await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany({
    marketBasketId: marketBasket.id,
    $or: [
      { 'category._id': { $nin: categoryIds } },
      { 'characteristic._id': { $nin: characteristicIds } },
    ]
  })

  // ! delete product answers where product no longer exists on market basket
  await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany({
    marketBasketId: marketBasket.id,
    $and: [
      { product: { $ne: null } },
      { 'product._id': { $nin: _.uniq(productIds) } },
    ]
  })

  // ! delete regimen answers where regimens no longer exist on market basket
  await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany({
    marketBasketId: marketBasket.id,
    $and: [
      { regimen: { $ne: null } },
      { 'regimen._id': { $nin: _.uniq(regimenIds) } }
    ]
  })
}

module.exports = removeSingleMarketBasketSurveyData
