const getColumnLetter = require('../utils/getColumnLetter')

const pushCatCharErrors = ({ row, maps, newErrors, rowIdx }) => {
  const {
    category_id,
    category_name,
    characteristic_id,
    characteristic_name,
  } = row

  const {
    categoriesMap,
    characteristicsMap,
    categoryCharacteristicMap,
  } = maps

  let doBothCategoryAndCharacteristicExist = true
  // 1. if category doesn't exist, persist error
  const isMarketBasketCategory = categoriesMap[category_id] !== undefined
  if (isMarketBasketCategory) {
    categoriesMap[category_id] = true
  } else {
    newErrors.push({
      rowIdx,
      column: getColumnLetter('category_id'),
      error: {
        errorMessage: 'CATEGORY NOT INCLUDED IN MARKET BASKET',
        value: `${category_name} (${category_id})`,
        suggestion: undefined
      }
    })

    doBothCategoryAndCharacteristicExist = false
  }

  // 2. if characteristic doesn't exist, persist error
  const isMarketBasketCharacteristic = characteristicsMap[characteristic_id] !== undefined
  if (isMarketBasketCharacteristic) {
    characteristicsMap[characteristic_id] = true
  } else {
    newErrors.push({
      rowIdx,
      column: getColumnLetter('characteristic_id'),
      error: {
        errorMessage: 'CHARACTERISTIC NOT INCLUDED IN MARKET BASKET',
        value: `${characteristic_name} (${characteristic_id})`,
        suggestion: undefined
      }
    })

    doBothCategoryAndCharacteristicExist = false
  }

  // 3. if both exist, but the pair doesn't, persist error
  if (doBothCategoryAndCharacteristicExist) {
    const catCharKey = [category_id, characteristic_id].join('|')
    const doesMatchCatCharCombo = categoryCharacteristicMap[catCharKey] !== undefined
    if (doesMatchCatCharCombo) {
      categoryCharacteristicMap[catCharKey] = true
    } else {
      newErrors.push({
        rowIdx,
        column: `${getColumnLetter('category_id')} + ${getColumnLetter('characteristic_id')}`,
        error: {
          errorMessage: 'CATEGORY / CHARACTERISTIC COMBO FAILED VALIDATION',
          value: `${category_name} / ${characteristic_name} (${category_id} / ${characteristic_id})`,
          suggestion: undefined
        }
      })
    }
  }
}

module.exports = pushCatCharErrors
