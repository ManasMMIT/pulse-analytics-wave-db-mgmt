const conjunctionMatchMaker = conjunction => {
  switch (conjunction) {
    case 'AND':
      return '$and'
    case 'OR':
      return '$or'
    default:
      return '$and'
  }
}

module.exports = conjunctionMatchMaker
