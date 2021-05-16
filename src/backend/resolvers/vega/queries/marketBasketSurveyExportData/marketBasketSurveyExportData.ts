import axios from 'axios'

const getCompleteQuestionSet = require('./getCompleteQuestionSet')
/*
  Needs to return data for export

  Final Schema:
  [
    {
      person: String // firstname lastname, probably
      category: String // probably just name
      characteristic: String // probably just name
      stakeholderRole: String // do later, probably
      regimen: String
      product: String
      manufacturer: String
      rating: Int

      personId: ID
      categoryId: ID
      characteristicId: ID
      regimenId: ID
      productId: ID
      manufacturerId: ID
    }
  ]

  Well, how?

  1. Get all permutations of market basket person+category+characteristic
  2. Hydrate combos that have data with a rating
*/

const marketBasketSurveyExportData = async (
  parent,
  { marketBasketId, surveyId },
  context,
  info
) => {
  surveyId = "39e7f556-6d29-4b18-ac19-ab0c77caaff1"
  const hydratedMarketBasketOp = axios
    .get(`hydrated-market-baskets/${marketBasketId}/`)
    .then(({ data }) => data)
    .catch(e => { throw new Error(e) })

  const hydratedSurveyQuestionsAnswersOp = axios
    .get(`hydrated-market-basket-surveys-questions/?survey__id__in=${surveyId}`)
    .then(({ data }) => data)
    .catch(e => { throw new Error(e) })

  const [
    hydratedMarketBasket,
    hydratedSurveyQuestionsAnswers,
  ] = await Promise.all([
    hydratedMarketBasketOp,
    hydratedSurveyQuestionsAnswersOp,
  ])
  /* 
    - From hydratedMarketBasket, I have category-characteristics and product-regimens
    - From hydratedSurveyQA, I have category-characteristics-product-regimen-manufacturer stakeholder-rating

    Goal:
    - Get complete set of possible questions
    - Hydrate questionId with questions that exist
    - Create questions that do not exist and hydrate questionId

    By this point, we have the entire question set stored in db

    - For each question, multiply by stakeholder set to get answers and non-answers. Stored answers should propagate an id 
  */

  const completeQuestionSet = getCompleteQuestionSet(
    hydratedMarketBasket.categories,
    hydratedMarketBasket.products_regimens,
  )

  return null
}

export default marketBasketSurveyExportData

const getStakeholderSet = (hydratedSurveyQuestionsAnswers) => {
  const {
    survey: { stakeholders: surveyStakeholders }
  } = hydratedSurveyQuestionsAnswers[0]

  const surveyStakeholderIds = surveyStakeholders.map(({ id }) => id)
}
