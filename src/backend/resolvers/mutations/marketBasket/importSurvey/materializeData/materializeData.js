const axios = require('axios')

module.exports = async ({ marketBasketId, surveyId, pulseDevDb }) => {
  const surveyQuestionsAndAnswers = await axios.get(
    `hydrated-market-basket-surveys-questions/?survey__id__in=${surveyId}`
  ).then(({ data }) => data)

  const docsToInsert = surveyQuestionsAndAnswers.reduce((acc, {
    id,
    survey: {
      date: surveyDate,
    },
    category,
    characteristic,
    regimen,
    product,
    manufacturer,
    answers,
  }) => {
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
    const flatAnswerDocs = answers.map(({ rating, stakeholder }) => ({
      _id: id,
      surveyId,
      marketBasketId,
      surveyDate,
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
        _id: stakeholder.id,
        firstName: stakeholder.first_name,
        lastName: stakeholder.last_name,
      }
    }))

    return [...acc, ...flatAnswerDocs]
  }, [])

  if (docsToInsert.length) {
    const [{ survey: { date: surveyDate } }] = surveyQuestionsAndAnswers
    await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany({ surveyId, surveyDate })
    await pulseDevDb.collection('marketBasketsSurveyAnswers').insertMany(docsToInsert)
  }
}
