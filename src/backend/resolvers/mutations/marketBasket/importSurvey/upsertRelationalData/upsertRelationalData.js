const axios = require('axios')

const getDataWithStableQuestionIds = require('./getDataWithStableQuestionIds')

module.exports = async ({ data, surveyId, socket }) => {
  socket.emit('Beginning upsertion of relational data')
  // fills in missing questionIds or creates questions and then injects questionIds
  const dataWithStableQuestionIds = await getDataWithStableQuestionIds(
    data,
    surveyId
  )

  socket.emit('Questions in sheet stabilized')

  const { updateData, createData } = dataWithStableQuestionIds.reduce(
    (acc, datum) => {
      // ? If answer_id is not in sheet, but exists
      // * should still fail to create any duplicate question+person id
      // * because of db validation
      if (datum.answer_id) {
        acc.updateData.push({
          id: datum.answer_id,
          rating: datum.rating,
        })
      } else {
        acc.createData.push({
          question: datum.question_id,
          rating: datum.rating,
          stakeholder: datum.person_id,
        })
      }

      return acc
    },
    { updateData: [], createData: [] }
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

  socket.emit('Successfully upserted relational data')
}
