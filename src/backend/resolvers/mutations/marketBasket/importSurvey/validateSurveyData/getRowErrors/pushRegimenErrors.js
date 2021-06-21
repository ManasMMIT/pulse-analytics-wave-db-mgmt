const getColumnLetter = require('../utils/getColumnLetter')

const pushRegimenErrors = ({ row, maps, newErrors, rowIdx }) => {
  const {
    regimen_id,
    regimen_name,
  } = row

  const {
    regimensMap,
  } = maps

  const isMarketBasketCharacteristic = regimensMap[regimen_id] !== undefined
  if (isMarketBasketCharacteristic) {
    regimensMap[regimen_id] = true
  } else {
    newErrors.push({
      rowIdx,
      column: getColumnLetter('regimen_id'),
      error: {
        errorMessage: 'REGIMEN NOT INCLUDED IN MARKET BASKET',
        value: `${regimen_name} (${regimen_id})`,
        suggestion: undefined
      }
    })
  }
}

module.exports = pushRegimenErrors
