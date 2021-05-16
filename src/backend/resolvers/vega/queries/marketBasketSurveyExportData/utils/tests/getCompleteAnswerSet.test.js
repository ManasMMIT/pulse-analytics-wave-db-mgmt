const _ = require('lodash')

const { stakeholders } = require('./sanity-input')
const sanityOutput = require('./sanity-output')

const getCompleteAnswerSet = require('../getCompleteAnswerSet')

const ORDER = ['categoryId', 'characteristicId', 'productId', 'regimenId', 'manufacturerId']

test('Simple input/output test', () => {
  const orderedSanityOutput = _.orderBy(sanityOutput, ORDER)
  const answerSet = getCompleteAnswerSet(orderedSanityOutput, stakeholders)

  expect(answerSet.length).toEqual(orderedSanityOutput.length * 2)
})
