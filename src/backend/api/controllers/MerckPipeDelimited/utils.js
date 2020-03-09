const _ = require('lodash')
const fs = require('fs')

const livesFilterToKey = (filterOption = '') => {
  // All medicare coverage (Medicare Advantage Medical, Medicare Part B Pharmacy, etc.)
  // will use medicare lives
  if (filterOption.includes('Medicare')) {
    const wordsArr = filterOption.split(' ')
    const coverage = wordsArr[wordsArr.length - 1]

    return `medicare${coverage}`
  }

  return _.camelCase(filterOption)
}

const usePlaceholderIfNeeded = value => value || ''

const medicareToMedicareAdvantage = book => book.includes('Medicare') ? 'Medicare Advantage Plan' : book

module.exports = {
  livesFilterToKey,
  usePlaceholderIfNeeded,
  medicareToMedicareAdvantage,
}
