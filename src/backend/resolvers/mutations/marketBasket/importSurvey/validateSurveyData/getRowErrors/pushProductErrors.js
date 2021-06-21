const getColumnLetter = require('../utils/getColumnLetter')

const pushProductErrors = ({ row, maps, newErrors, rowIdx }) => {
  const {
    product_id,
    product_brand_name,
    product_generic_name,
  } = row

  const {
    productsMap,
  } = maps

  const isMarketBasketProduct = productsMap[product_id] !== undefined
  if (isMarketBasketProduct) {
    productsMap[product_id] = true
  } else {
    newErrors.push({
      rowIdx,
      column: getColumnLetter('product_id'),
      error: {
        errorMessage: 'PRODUCT NOT INCLUDED IN MARKET BASKET',
        value: `${product_brand_name}${product_generic_name ? ' / ' + product_generic_name : ''} (${product_id})`,
        suggestion: undefined
      }
    })
  }
}

module.exports = pushProductErrors
