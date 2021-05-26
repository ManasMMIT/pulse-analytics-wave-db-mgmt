module.exports = ({ surveyQuestionsAndAnswers, survey }) => {
  return surveyQuestionsAndAnswers.reduce(
    (
      acc,
      { category, characteristic, regimen, product, manufacturer, answers }
    ) => {
      let productObj
      if (product) {
        productObj = {
          _id: product.id,
          genericName: product.generic_name,
          brandName: product.brand_name,
        }
      }

      let regimenObj
      if (regimen) {
        regimenObj = {
          _id: regimen.id,
          name: regimen.name,
        }
      }

      let manufacturerObj
      if (manufacturer) {
        manufacturerObj = {
          _id: manufacturer.id,
          name: manufacturer.name,
        }
      }
      const flatAnswerDocs = answers.map(
        ({ id: answerId, rating, stakeholder_full }) => ({
          _id: answerId,
          surveyId: survey.id,
          marketBasketId: survey.market_basket,
          surveyDate: new Date(survey.date),
          category: {
            _id: category.id,
            name: category.name,
            prompt: category.prompt,
            type: category.category_type,
          },
          characteristic: {
            _id: characteristic.id,
            name: characteristic.name,
            description: characteristic.description,
          },
          regimen: regimenObj,
          product: productObj,
          manufacturer: manufacturerObj,
          rating,
          stakeholder: {
            _id: stakeholder_full.id,
            firstName: stakeholder_full.first_name,
            lastName: stakeholder_full.last_name,
          },
        })
      )

      return [...acc, ...flatAnswerDocs]
    },
    []
  )
}
