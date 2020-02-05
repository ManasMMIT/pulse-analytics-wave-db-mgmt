const fieldMatchMaker = word => {
  switch (word) {
    case 'organization':
    case 'organizations':
    case 'indication':
    case 'indications':
      return '_id'
    default:
      return null
  }
}

module.exports = fieldMatchMaker