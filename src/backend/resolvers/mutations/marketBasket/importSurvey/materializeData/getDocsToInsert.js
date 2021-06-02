module.exports = ({ surveyQuestionsAndAnswers, survey }) => {
  return surveyQuestionsAndAnswers
    .filter(({ rating }) => Boolean(rating))
    .map(({
      category_id,
      category_name,
      category_prompt,
      category_type,
      characteristic_id,
      characteristic_name,
      characteristic_description,
      product_id,
      product_generic_name,
      product_brand_name,
      regimen_id,
      regimen_name,
      manufacturer_id,
      manufacturer_name,
      person_id,
      first_name,
      middle_name,
      last_name,
      primary_role,
      primary_role_type,
      question_id,
      answer_id,
      rating,
    }) => {
      let productObj
      if (product_id) {
        productObj = {
          _id: product_id,
          genericName: product_generic_name,
          brandName: product_brand_name,
        }
      }

      let regimenObj
      if (regimen_id) {
        regimenObj = {
          _id: regimen_id,
          name: regimen_name,
        }
      }

      let manufacturerObj
      if (manufacturer_id) {
        manufacturerObj = {
          _id: manufacturer_id,
          name: manufacturer_name,
        }
      }

      return {
        _id: answer_id,
        surveyId: survey.id,
        marketBasketId: survey.market_basket,
        surveyDate: new Date(survey.date),
        category: {
          _id: category_id,
          name: category_name,
          prompt: category_prompt,
          type: category_type,
        },
        characteristic: {
          _id: characteristic_id,
          name: characteristic_name,
          description: characteristic_description,
        },
        regimen: regimenObj,
        product: productObj,
        manufacturer: manufacturerObj,
        rating,
        stakeholder: {
          _id: person_id,
          primaryRole: primary_role,
          primaryRoleType: primary_role_type,
          // firstName: first_name,
          // middle_name: middle_name,
          // lastName: last_name,
        },
      }
    })
}
