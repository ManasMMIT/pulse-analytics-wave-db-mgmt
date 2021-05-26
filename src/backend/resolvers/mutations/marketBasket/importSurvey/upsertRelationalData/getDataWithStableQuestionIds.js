const axios = require('axios')
const _ = require('lodash')
const { v4: uuid4 } = require('uuid')

const getDataWithStableQuestionIds = async (
  data,
  surveyId,
) => {
  const surveyQuestions = await axios
    .get(`market-basket-surveys-questions/?survey=${surveyId}`)
    .then(({ data }) => data)
    .catch(e => { throw new Error(e) })

  const surveyQuestionsByParts = _.keyBy(
    surveyQuestions,
    ({ category, characteristic, regimen, product, manufacturer }) => [category, characteristic, regimen, product, manufacturer].join('|')
  )

  const clonedData = _.cloneDeep(data)

  const questionsToCreate = clonedData.reduce((acc, datum) => {
    const {
      question_id,
      category_id,
      characteristic_id,
      regimen_id,
      product_id,
      manufacturer_id,
    } = datum

    if (question_id) return acc

    const mapKey = [
      category_id,
      characteristic_id,
      regimen_id,
      product_id,
      manufacturer_id,
    ].join('|')

    const preExistingQuestion = surveyQuestionsByParts[mapKey]

    if (preExistingQuestion) {
      datum.question_id = preExistingQuestion.id
      console.log(`Missing question_id ${preExistingQuestion.id} injected into sheet data`)
      return acc
    }

    /*
      -> Answer does not have a question id
      -> Answer is not to a pre-existing question
      -> Create new question for survey
    */
    const id = uuid4()
    const questionToCreate = {
      id,
      survey: surveyId,
      category: category_id,
      characteristic: characteristic_id,
      regimen: regimen_id,
      product: product_id,
      manufacturer: manufacturer_id,
    }

    datum.question_id = id

    return [...acc, questionToCreate]
  }, [])

  if (questionsToCreate.length) {
    await axios.post('market-basket-surveys-questions/bulk_create/', questionsToCreate)
      .then(({ data }) => data)
      .catch(e => { throw new Error(e) })
  }

  return clonedData
}

module.exports = getDataWithStableQuestionIds
