module.exports = (questions, stakeholders) => questions.reduce((acc, question) => {
  const stakeholderQuestions = stakeholders.map(({
    first_name,
    last_name,
    id: personId,
  }) => ({
    ...question,
    person: first_name + ' ' + last_name,
    personId,
    rating: undefined,
  }))

  return [...acc, ...stakeholderQuestions]
}, [])
