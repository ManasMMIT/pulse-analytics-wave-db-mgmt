module.exports = (survey, marketBasket) => {
  const stakeholdersMap = survey.stakeholders.reduce(
    (map, stakeholderId) => ({ ...map, [stakeholderId]: false }), {}
  )

  const {
    categoriesMap,
    characteristicsMap,
    categoryCharacteristicMap,
  } = getCatCharMaps(marketBasket)

  const {
    productsMap,
    regimensMap,
    manufacturersMap,
  } = getProdRegManMaps(marketBasket)

  return {
    stakeholdersMap,
    categoriesMap,
    characteristicsMap,
    categoryCharacteristicMap,
    productsMap,
    regimensMap,
    manufacturersMap,
  }
}

const getCatCharMaps = (marketBasket) => {
  return marketBasket.categories.reduce((maps, { id: categoryId, characteristics }) => {
    maps.categoriesMap[categoryId] = false

    characteristics.forEach((characteristicId) => {
      maps.characteristicsMap[characteristicId] = false

      const comboId = [categoryId, characteristicId].join('|')
      maps.categoryCharacteristicMap[comboId] = false
    })

    return maps
  },
    { categoriesMap: {}, characteristicsMap: {}, categoryCharacteristicMap: {} }
  )
}

const getProdRegManMaps = (marketBasket) => {
  return marketBasket.products_regimens.reduce((maps, { product: { id: productId, manufacturers }, regimen: { id: regimenId } }) => {
    maps.productsMap[productId] = false
    maps.regimensMap[regimenId] = false

    manufacturers.forEach(({ id: manufacturerId }) => maps.manufacturersMap[manufacturerId] = false)

    return maps
  },
    { productsMap: {}, regimensMap: {}, manufacturersMap: {} }
  )
}

