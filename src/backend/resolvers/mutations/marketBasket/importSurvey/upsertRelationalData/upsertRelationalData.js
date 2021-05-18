const axios = require('axios')

const getDataWithStableQuestionIds = require('./getDataWithStableQuestionIds')

module.exports = async ({ data, surveyId }) => {
  // fills in missing questionIds or creates questions and then injects questionIds
  const dataWithStableQuestionIds = await getDataWithStableQuestionIds(
    data,
    surveyId
  )

  const ops = dataWithStableQuestionIds.reduce((acc, datum) => {
    const upsertAnswerOp = datum.answerId ? updateAnswer(datum) : createAnswer(datum)

    return [...acc, upsertAnswerOp]
  }, [])

  return Promise.all(ops)
}

const updateAnswer = ({ answerId, rating }) => {
  const uri = `market-basket-surveys-questions-answers/${answerId}/`
  const patchObj = { rating }

  return axios.patch(uri, patchObj)
    // .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

const createAnswer = ({
  personId, rating, questionId
}) => {
  const uri = 'market-basket-surveys-questions-answers/'
  const postObj = { question: questionId, stakeholder: personId, rating }

  return axios.post(uri, postObj)
    // .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}
