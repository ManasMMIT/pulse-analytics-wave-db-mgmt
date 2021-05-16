const _ = require('lodash')

const { categories, productsRegimens, } = require('./sanity-input')
const sanityOutput = require('./sanity-output')

const getCompleteQuestionSet = require('../getCompleteQuestionSet')

const ORDER = ['categoryId', 'characteristicId', 'productId', 'regimenId', 'manufacturerId']

test('Simple input/output test', () => {
  let questionSet = getCompleteQuestionSet(categories, productsRegimens)
  questionSet = _.orderBy(questionSet, ORDER)

  const orderedSanityOutput = _.orderBy(sanityOutput, ORDER)

  expect(questionSet).toEqual(orderedSanityOutput)
})
