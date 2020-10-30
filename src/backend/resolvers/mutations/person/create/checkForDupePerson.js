const _ = require('lodash')
const stringSimilarity = require('string-similarity')

module.exports = async ({ personData, pulseCoreDb }) => {
  const { firstName: targetFirstName, lastName: targetLastName } = personData

  let people = await pulseCoreDb.collection('people').find().toArray()
  people = people.map(({ firstName, lastName }) => `${firstName} ${lastName}`)

  let { ratings, bestMatch } = stringSimilarity.findBestMatch(
    `${targetFirstName} ${targetLastName}`,
    people
  )

  if (bestMatch.rating > 0.8) {
    ratings = _.orderBy(ratings, ['rating'], ['desc'])
    const topThreeMatches = ratings.slice(0, 3)

    const suggestions = topThreeMatches
      .map(({ target: similarName }) => similarName)
      .join(', ')

    throw new Error(`Similar names already in database: ${suggestions}`)
  }
}
