const axios = require('axios')
const _ = require('lodash')

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

  const ops = clonedData.reduce((acc, datum) => {
    const {
      questionId,
      categoryId,
      characteristicId,
      regimenId,
      productId,
      manufacturerId,
    } = datum

    if (questionId) return acc

    const mapKey = [
      categoryId,
      characteristicId,
      regimenId,
      productId,
      manufacturerId,
    ].join('|')

    const preExistingQuestion = surveyQuestionsByParts[mapKey]

    if (preExistingQuestion) {
      datum.questionId = preExistingQuestion.id
      return acc
    }

    /*
      -> Answer does not have a question id
      -> Answer is not to a pre-existing question
      -> Create new question for survey
    */
    const newOp = async () => {
      const postObj = {
        survey: surveyId,
        category: categoryId,
        characteristic: characteristicId,
        regimen: regimenId,
        product: productId,
        manufacturer: manufacturerId,
      }
      const uri = 'market-basket-surveys-questions/'
      const { id: questionId } = await axios.post(uri, postObj)
        .then(({ data }) => data)
        .catch((e) => {
          throw new Error(JSON.stringify(e.response.data))
        })

      datum.questionId = questionId
    }

    return [...acc, newOp()]
  }, [])

  await Promise.all(ops)

  return clonedData
}

module.exports = getDataWithStableQuestionIds
