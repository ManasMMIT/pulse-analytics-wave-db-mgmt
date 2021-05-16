const getMapKey = (answer) => {
  const {
    question: {
      category: categoryId,
      characteristic: characteristicId,
      regimen: regimenId,
      product: productId,
      manufacturer: manufacturerId,
    },
    stakeholder: { id: personId }
  } = answer

  return [
    categoryId,
    characteristicId,
    regimenId,
    productId,
    manufacturerId,
    personId,
  ].join('|')
}

const getMapValue = (answer) => {
  const {
    question: {
      id: questionId,
    },
    rating,
  } = answer

  return { questionId, rating }
}

module.exports = (completeAnswerSet, hydratedSurveyQuestionsAnswers) => {
  const questionsAnswersMap = hydratedSurveyQuestionsAnswers
    .reduce((acc, { answers }) => {
      answers.forEach(answer => {
        const mapKey = getMapKey(answer)
        acc[mapKey] = getMapValue(answer)
      })

      return acc
    }, {})

  return completeAnswerSet.map(answer => {
    const {
      categoryId,
      characteristicId,
      regimenId,
      productId,
      manufacturerId,
      personId,
    } = answer

    const mapKey = [categoryId,
      characteristicId,
      regimenId,
      productId,
      manufacturerId,
      personId,
    ].join('|')

    const existingAnswerInfo = questionsAnswersMap[mapKey]

    if (existingAnswerInfo) {
      return { ...answer, ...existingAnswerInfo }
    } else {
      return { questionId: undefined, rating: undefined, ...answer }
    }
  })
}
