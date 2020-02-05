const fieldMatchMaker = word => {
  switch (word) {
    case 'organization':
    case 'organizations':
    case 'indication':
    case 'indications':
      return '_id'
    case 'orgTypes':
    case 'orgType':
      return 'type'
    default:
      return null
  }
}

module.exports = fieldMatchMaker