const _ = require('lodash')

/*
  ! This sheetMap is a stepping stone to a more robust
    ! Sheet Management system, where we're tracking fields and target
    ! collections for each sheet.
  
  ! Any new collections needed in the email alerts system
    ! should be added to this map, so that they
    ! can be properly validated for each user 
*/

const sheetMap = require('./TEMP-sheet-management-mocks')

const sheetMapByCollection = _.keyBy(sheetMap, 'collection')

const assessFilterParams = collection => {
  let indicationRegimenSlugFieldsExist = false
  let indicationRegimenFieldsExist = false
  let regimenSlugFieldsExist = false
  let indicationSlugFieldsExist = false
  let indicationFieldExists = false
  let regimenFieldExists = false
  let slugFieldExists = false

  const { fields } = sheetMapByCollection[collection]

  if (fields.length) {
    const {
      indication,
      regimen,
      product,
      slug,
    } = fields.reduce((acc, field) => {
        acc[field.key] = true

        return acc
      }, {})

    if (indication && (regimen || product) && slug) {
      indicationRegimenSlugFieldsExist = true
    } else if (indication && (regimen || product)) {
      indicationRegimenFieldsExist = true
    } else if (slug && (regimen || product)) {
      regimenSlugFieldsExist = true
    } else if (slug && indication) {
      indicationSlugFieldsExist = true
    } else if (indication) {
      indicationFieldExists = true
    } else if (regimen || product) {
      regimenFieldExists = true
    } else if (slug) {
      slugFieldExists = true
    }
  }

  return {
    indicationRegimenSlugFieldsExist,
    indicationRegimenFieldsExist,
    regimenSlugFieldsExist,
    indicationSlugFieldsExist,
    indicationFieldExists,
    regimenFieldExists,
    slugFieldExists,
  }
}

module.exports = assessFilterParams
