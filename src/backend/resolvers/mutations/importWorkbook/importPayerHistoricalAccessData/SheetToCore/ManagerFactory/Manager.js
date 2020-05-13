const _ = require('lodash')

const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../../utils/defaultTimeZone')

const {
  payerCombinationHasher
} = require('../../utils')

class Manager {
  constructor({
    sheetData = [], timestamp, hashType = 'ptps', projectId
  }) {

    this.sheetData = sheetData
    this.projectId = projectId

    // create JS Date Object (which only stores dates in absolute UTC time) as the UTC equivalent of isoShortString in New York time
    this.setTimeZone(timestamp)

    // Set default hasher 
    this.payerCombinationHasher = payerCombinationHasher(hashType)
  }

  setTimeZone(timestamp) {
    this.timestamp = zonedTimeToUtc(timestamp, DEFAULT_TIMEZONE)
  }

  setEnrichedPtpsByCombination(enrichedPtps = []) {
    this.enrichedPtpsByCombo = _.groupBy(enrichedPtps, this.payerCombinationHasher)
  }

  getFilteredAndEnrichedSheetData() {
    const copiedSheetData = _.cloneDeep(this.sheetData)

    const result = copiedSheetData.reduce((acc, datum) => {
      const payerComboString = this.payerCombinationHasher(datum)
      const enrichedPtpsForCombo = this.enrichedPtpsByCombo[payerComboString]

      // this line shouldn't ever execute thanks to validation layer
      if (!enrichedPtpsForCombo) return acc

      enrichedPtpsForCombo.forEach(({ 
        _id, 
        organizationId, 
        treatmentPlanId,
      }) => {
        acc = [
          ...acc,
          {
            ...datum,
            orgTpId: _id,
            organizationId,
            treatmentPlanId,
          },
        ]
      })

      return acc
    }, [])

    return result
  }
}

module.exports = Manager
