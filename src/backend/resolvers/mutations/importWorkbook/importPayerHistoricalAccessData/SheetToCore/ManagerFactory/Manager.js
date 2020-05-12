const { ObjectId } = require('mongodb')
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

  setOrgsHashBySlug(setOrgs = []) {
    this.orgsHashBySlug = _.keyBy(setOrgs, 'slug')
  }

  setEnrichedPtpsByCombination(setEnrichedPtps = []) {
    this.enrichedPtpsByCombo = _.groupBy(setEnrichedPtps, this.payerCombinationHasher)
  }

  setQualityOfAccessHash(setQualityOfAccesses = []) {
    this.qualityOfAccessHash = _.keyBy(setQualityOfAccesses, 'access')
  }

  setupHashes({ setOrgs, setEnrichedPtps, setQualityOfAccesses }) {
    this.setOrgsHashBySlug(setOrgs)
    this.setEnrichedCombination(setEnrichedPtps)
    this.setQualityOfAccessHash(setQualityOfAccesses)
  }

  getFilteredAndEnrichedSheetData() {
    const copiedSheetData = _.cloneDeep(this.sheetData)

    const result = copiedSheetData.reduce((acc, datum) => {
      const payerComboString = this.payerCombinationHasher(datum)
      const enrichedPtpsForCombo = this.enrichedPtpsByCombo[payerComboString]

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
