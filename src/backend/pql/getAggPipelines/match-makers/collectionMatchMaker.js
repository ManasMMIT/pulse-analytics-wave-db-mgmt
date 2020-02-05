const collectionMatchMaker = word => {
  switch (word) {
    case 'organization':
    case 'organizations':
      return 'organizations'
    case 'indication':
    case 'indications':
      return 'indications'
    default:
      return null
  }
}

module.exports = collectionMatchMaker
