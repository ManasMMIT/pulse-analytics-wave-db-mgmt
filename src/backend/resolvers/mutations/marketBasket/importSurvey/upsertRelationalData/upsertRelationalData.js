const axios = require('axios')

const getDataWithStableQuestionIds = require('./getDataWithStableQuestionIds')
const FALSEY_VALUES_MAP = require('./../utils/falsey-values-map')

module.exports = async ({ data, surveyId, socket }) => {
  socket.emit('Beginning upsertion of relational data')
  // fills in missing questionIds or creates questions and then injects questionIds
  const dataWithStableQuestionIds = await getDataWithStableQuestionIds(
    data,
    surveyId
  )

  socket.emit('Questions in sheet stabilized')

  const {
    updateData,
    createData,
    deleteData,
  } = dataWithStableQuestionIds.reduce(
    (acc, datum) => {
      const isMissingRating = FALSEY_VALUES_MAP[datum.rating]
      const doesAnswerExist = datum.answer_id
      // ? If answer_id is not in sheet, but exists
      // * should still fail to create any duplicate question+person id
      // * because of db validation
      if (doesAnswerExist) {
        if (isMissingRating) {
          acc.deleteData.push(datum.answer_id)
        } else {
          acc.updateData.push({
            id: datum.answer_id,
            rating: datum.rating,
          })
        }
      } else {
        if (isMissingRating) return acc

        acc.createData.push({
          question: datum.question_id,
          rating: datum.rating,
          stakeholder: datum.person_id,
        })
      }

      return acc
    },
    { updateData: [], createData: [], deleteData: [] }
  )

  if (updateData.length) {
    socket.emit('Updating survey answers')

    await axios
      .patch('market-basket-surveys-questions-answers/bulk_update/', updateData)
      .catch((e) => {
        throw new Error(e)
      })

    socket.emit('All existing answers have been updated')
  }

  if (createData.length) {
    socket.emit('Creating survey answers')

    await axios
      .post('market-basket-surveys-questions-answers/bulk_create/', createData)
      .catch((e) => {
        throw new Error(e)
      })

    socket.emit('All new answers have been created')
  }

  if (deleteData.length) {
    socket.emit('Deleting survey answers without ratings')

    await axios
      .delete('market-basket-surveys-questions-answers/bulk_delete/', { data: deleteData })
      .catch((e) => {
        throw new Error(e)
      })

    socket.emit('Answers without ratings deleted')
  }

  socket.emit('Successfully upserted relational data')
}
