import _ from 'lodash'

module.exports = (categories, products_regimens) => {
  const categoriesCharacteristicsSetByType = getCategoriesCharacteristicsSetByType(categories || [])
  const { productsSet, regimensSet } = getProductsRegimensSets(products_regimens || [])
  const manufacturersSet = getManufacturersSet(products_regimens || [])

  const completeQuestionSet = Object.entries(categoriesCharacteristicsSetByType)
    .reduce((acc, [category_type, catCharCombos]) => {
      let fullCombos = []
      if (category_type === 'product') {
        fullCombos = catCharCombos.reduce((acc, catCharObj) => {
          const fullCombo = productsSet.map(productObj => ({ ...productObj, ...catCharObj }))
          return [...acc, ...fullCombo]
        }, [])
      } else if (category_type === 'regimen') {
        fullCombos = catCharCombos.reduce((acc, catCharObj) => {
          const fullCombo = regimensSet.map(regimenObj => ({ ...regimenObj, ...catCharObj }))
          return [...acc, ...fullCombo]
        }, [])
      } else if (category_type === 'manufacturer') {
        fullCombos = catCharCombos.reduce((acc, catCharObj) => {
          const fullCombo = manufacturersSet.map(manufacturerObj => ({ ...manufacturerObj, ...catCharObj }))
          return [...acc, ...fullCombo]
        }, [])
      }
      const uniqueSet = new Set(fullCombos)

      return [...acc, ...Array.from(uniqueSet)]
    }, [])

  return completeQuestionSet
}

const getCategoriesCharacteristicsSetByType = (categories) => categories.reduce((acc, category) => {
  // shouldn't be empty, but validation logic isn't robust enough yet to cover this case
  // for now, going to ignore any categories that have no characteristics in the export
  if (_.isEmpty(category.characteristics_full)) return acc

  const { id, name, characteristics_full, category_type } = category

  const categoryCharacteristicCombo = characteristics_full.map(({
    id: characteristicId,
    name: characteristic,
  }) => ({
    category: name,
    characteristic,
    characteristicId,
    categoryId: id,
  }))

  acc[category_type]
    ? acc[category_type] = [...categoryCharacteristicCombo, ...acc[category_type]]
    : acc[category_type] = categoryCharacteristicCombo

  return acc
}, {})

const getProductsRegimensSets = (products_regimens) => products_regimens.reduce((acc, { product, regimen }) => {
  // TODO: Figure out how we want to render product's generic and brand name. same field?
  acc.productsSet = [{
    product: product.generic_name,
    productId: product.id,
  }, ...acc.productsSet]

  acc.regimensSet = [{
    regimen: regimen.name,
    regimenId: regimen.id,
  }, ...acc.regimensSet]

  return acc
}, { productsSet: [], regimensSet: [] })

const getManufacturersSet = (products_regimens) => {
  const flattenedManufacturersWithDupes = products_regimens.reduce((acc, { product }) => {
    const manufacturers = product.manufacturers.map(({ id, name }) => ({
      manufacturer: name,
      manufacturerId: id,
    }))
    return [...acc, ...manufacturers]
  }, [])

  return _.uniqBy(flattenedManufacturersWithDupes, 'manufacturerId')
}
