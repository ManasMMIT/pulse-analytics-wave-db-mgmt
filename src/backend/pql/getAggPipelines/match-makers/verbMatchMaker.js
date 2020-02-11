const verbMatchMaker = verb => {
  switch (verb) {
    case '=':
      return '$in'
    case '!=':
      return '$nin'
    default:
      return '$in'
  }
}

module.exports = verbMatchMaker
