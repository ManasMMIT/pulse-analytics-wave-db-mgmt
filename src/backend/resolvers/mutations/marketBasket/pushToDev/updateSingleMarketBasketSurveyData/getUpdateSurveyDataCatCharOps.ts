function getUpdateSurveyDataCatCharOps(marketBasket: any, pulseDevDb: any): { updateSurveyDataCategoryOps: any; updateSurveyDataCharacteristicOps: any } {
  return marketBasket.categories.reduce((acc, { id, characteristics, characteristics_full, ...category }) => {
    acc.updateSurveyDataCategoryOps.push(
      pulseDevDb.collection('marketBasketsSurveyAnswers')
        .updateMany(
          { 'category._id': id },
          {
            $set: {
              'category.name': category.name,
              'category.prompt': category.prompt,
              'category.type': category.category_type,
            }
          })
    )

    characteristics_full.forEach(({ id, name, description }) => {
      acc.updateSurveyDataCharacteristicOps.push(
        pulseDevDb.collection('marketBasketsSurveyAnswers')
          .updateMany(
            { 'characteristic._id': id },
            {
              $set: {
                'characteristic.name': name,
                'characteristic.description': description,
              }
            })
      )
    })
    return acc
  }, { updateSurveyDataCategoryOps: [], updateSurveyDataCharacteristicOps: [] })
}

export default getUpdateSurveyDataCatCharOps
