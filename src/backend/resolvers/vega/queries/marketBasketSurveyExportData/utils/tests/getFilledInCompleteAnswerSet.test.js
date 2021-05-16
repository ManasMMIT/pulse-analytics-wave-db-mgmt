const _ = require('lodash')

const { stakeholders, hydratedSurveyQuestionsAnswers } = require('./sanity-input')
const sanityOutput = require('./sanity-output')

const getCompleteAnswerSet = require('../getCompleteAnswerSet')
const getFilledInCompleteAnswerSet = require('../getFilledInCompleteAnswerSet')

const ORDER = ['categoryId', 'characteristicId', 'productId', 'regimenId', 'manufacturerId']

test('Simple input/output test', () => {
  const orderedSanityOutput = _.orderBy(sanityOutput, ORDER)
  const answerSet = getCompleteAnswerSet(orderedSanityOutput, stakeholders)

  const filledInAnswers = getFilledInCompleteAnswerSet(answerSet, hydratedSurveyQuestionsAnswers)
  const hasExistingData = filledInAnswers.some(({ rating }) => Boolean(rating))

  expect(hasExistingData).toBe(true)
})
