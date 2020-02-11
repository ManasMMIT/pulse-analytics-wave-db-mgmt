const { collectionMatchMaker } = require('../match-makers')

const clauseRegex = /(\w+)(=|!=)\(\w*[,\w\s]*\)/gi
const matchingConjunctions = /(AND|OR)/g

const getClauseParts = clause => {
  const matchAllVerbsRegex = /(=|!=)/

  const verb = clause.match(matchAllVerbsRegex)[0]

  const [subject, valuesWithParens] = clause.split(verb)

  const cleanValues = valuesWithParens
    .replace(/[()]/g, '')
    .split(',')

  return {
    subject,
    verb,
    value: cleanValues,
  }
}

module.exports = pql => {
  const clauseMatches = pql.match(clauseRegex)
  const conjunctionsMatches = pql.match(matchingConjunctions)

  if (!clauseMatches) {
    throw new Error('There are no matches for this PQL string')
  } else if (clauseMatches.length > 1 && !conjunctionsMatches) {
    throw new Error('Conjunctions required between all clauses')
  }

  return clauseMatches.reduce((acc, clause) => {
    const {
      subject,
      verb,
      value,
    } = getClauseParts(clause)

    const collection = collectionMatchMaker(subject)

    if (!acc[collection]) {
      acc[collection] = [
        [],
        [],
        [],
        [],
      ]
    }

    acc[collection][0].push(subject)
    acc[collection][1].push(verb)
    acc[collection][2].push(value)

    if (acc[collection][0].length > 1) {
      acc[collection][3].push(
        conjunctionsMatches.shift()
      )
    }

    return acc
  }, {})
}
