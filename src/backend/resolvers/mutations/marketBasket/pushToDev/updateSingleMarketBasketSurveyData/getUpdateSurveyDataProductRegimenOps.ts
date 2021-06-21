function getUpdateSurveyDataProductRegimenOps(marketBasket: any, pulseDevDb: any) {
  const seenProducts = {}
  const seenRegimens = {}
  return marketBasket.products_regimens.reduce((
    acc,
    { product, regimen }
  ) => {
    if (!seenProducts[product.id]) {
      acc.push(
        pulseDevDb.collection('marketBasketsSurveyAnswers')
          .updateMany(
            { 'product._id': product.id },
            {
              $set: {
                'product.name': product.name,
              }
            })
      )
    }
    seenProducts[product.id] = true

    if (!seenRegimens[regimen.id]) {
      acc.push(
        pulseDevDb.collection('marketBasketsSurveyAnswers')
          .updateMany(
            { 'regimen._id': regimen.id },
            {
              $set: {
                'regimen.name': regimen.name,
              }
            })
      )
    }
    seenRegimens[regimen.id] = true

    return acc
  }, [])
}

export default getUpdateSurveyDataProductRegimenOps
