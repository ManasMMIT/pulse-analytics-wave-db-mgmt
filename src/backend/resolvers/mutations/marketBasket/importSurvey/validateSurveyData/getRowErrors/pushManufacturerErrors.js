const getColumnLetter = require('../utils/getColumnLetter')

const pushManufacturerErrors = ({ row, maps, newErrors, rowIdx }) => {
  const {
    manufacturer_id,
    manufacturer_name,
  } = row

  const {
    manufacturersMap,
  } = maps

  const isMarketBasketCharacteristic = manufacturersMap[manufacturer_id] !== undefined
  if (isMarketBasketCharacteristic) {
    manufacturersMap[manufacturer_id] = true
  } else {
    newErrors.push({
      rowIdx,
      column: getColumnLetter('manufacturer_id'),
      error: {
        errorMessage: 'MANUFACTURER NOT ASSOCATIED WITH PRODUCTS IN MARKET BASKET',
        value: `${manufacturer_name} (${manufacturer_id})`,
        suggestion: undefined
      }
    })
  }
}

module.exports = pushManufacturerErrors
