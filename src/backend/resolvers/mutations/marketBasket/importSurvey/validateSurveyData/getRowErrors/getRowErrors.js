const getColumnLetter = require('../utils/getColumnLetter')

const pushCatCharErrors = require('./pushCatCharErrors')
const pushStakeholderErrors = require('./pushStakeholderErrors')
const pushProductErrors = require('./pushProductErrors')
const pushRegimenErrors = require('./pushRegimenErrors')
const pushManufacturerErrors = require('./pushManufacturerErrors')

// TODO: Validate that rating is within the market basket's set range

module.exports = (data, maps,) => {
  return data.reduce((errors, row, idx) => {
    const rowIdx = 2 + idx
    const newErrors = []

    pushCatCharErrors({ row, maps, newErrors, rowIdx })
    pushStakeholderErrors({ row, maps, newErrors, rowIdx })

    const existingProdRegManIds = [row.product_id, row.regimen_id, row.manufacturer_id].filter(Boolean)
    if (existingProdRegManIds.length !== 1) {
      newErrors.push({
        rowIdx,
        column: [
          getColumnLetter('regimen_id'),
          getColumnLetter('product_id'),
          getColumnLetter('manufacturer_id'),
        ].join(', '),
        error: {
          errorMessage: 'ROW MUST INCLUDE EXACTLY ONE OF THE FOLLOWING: product_id, regimen_id, or manufacturer_id',
          value: existingProdRegManIds.join(', '),
          suggestion: undefined,
        }
      })
    } else {
      if (row.product_id)
        pushProductErrors({ row, maps, newErrors, rowIdx })
      else if (row.regimen_id)
        pushRegimenErrors({ row, maps, newErrors, rowIdx })
      else if (row.manufacturer_id)
        pushManufacturerErrors({ row, maps, newErrors, rowIdx })
    }

    return [...errors, ...newErrors]
  }, [])
}


