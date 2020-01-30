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

const promisify = (filename, input) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, input, err => {
      if (err) {
        console.log(`Error writing to ${filename}`)
        reject(err)
      } else {
        console.log(`Successfully written to ${filename}`)
        resolve()
      }
    })
  })
}

const medicareToMedicareAdvantage = book => book.includes('Medicare') ? 'Medicare Advantage Plan' : book

module.exports = {
  livesFilterToKey,
  usePlaceholderIfNeeded,
  promisify,
  medicareToMedicareAdvantage,
}
