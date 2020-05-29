// ! Basic view on frontend only supports AND with =

const SUPPORTED_CONJUNCTIONS_MAP = {
  'AND': '$and',
}

const SUPPORTED_VERBS_MAP = {
  '=': '$in',
}

const supportedVerbsPiped = Object.keys(SUPPORTED_VERBS_MAP).join('|')
const supportedConjunctionsPiped = Object.keys(SUPPORTED_CONJUNCTIONS_MAP).join('|')

const clauseRegex = new RegExp(`(\\w+)(${supportedVerbsPiped})\\(\\w*[,\\w\\s-"]*\\)`, 'gi')
const matchingConjunctions = new RegExp(`(${supportedConjunctionsPiped})`, 'g')

const getClauseParts = clause => {
  const matchAllVerbsRegex = new RegExp(`(${supportedVerbsPiped})`)

  const verb = clause.match(matchAllVerbsRegex)[0]

  const [subject, valuesWithFluff] = clause.split(verb)

  const cleanValues = (
    valuesWithFluff.match(/"[\w\s-,]+"/g) || []
  ).map(v => v.replace(/"/g, ''))

  return {
    subject,
    verb,
    value: cleanValues,
  }
}

module.exports = pql => {
  const clauseMatches = pql.match(clauseRegex)
  const conjunctionsMatches = pql.match(matchingConjunctions)

  if (!clauseMatches) return {}

  return clauseMatches.reduce((acc, clause) => {
    const {
      subject,
      verb,
      value,
    } = getClauseParts(clause)

    if (!value.length) return acc

    acc[0].push(subject)
    acc[1].push(verb)
    acc[2].push(value)

    if (acc[0].length > 1) {
      acc[3].push(
        conjunctionsMatches.shift()
      )
    }

    return acc
  }, [
    [],
    [],
    [],
    [],
  ])
}
