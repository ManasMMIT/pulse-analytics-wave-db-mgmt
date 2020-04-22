const getIsQualityAccessSheet = sheetName => /Quality of Access/.test(sheetName)

const getIsAdditionalCriteriaSheet = sheetName => /Additional Criteria/.test(sheetName)

const getIsPolicyLinksSheet = sheetName => /Policy Links/.test(sheetName)

module.exports = {
  getIsQualityAccessSheet,
  getIsAdditionalCriteriaSheet,
  getIsPolicyLinksSheet,
}
