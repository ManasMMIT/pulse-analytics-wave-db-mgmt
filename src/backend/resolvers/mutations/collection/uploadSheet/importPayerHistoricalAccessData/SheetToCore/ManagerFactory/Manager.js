const { ObjectId } = require('mongodb')
const _ = require('lodash')

const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../../../utils/defaultTimeZone')

const {
  payerCombinationHasher
} = require('../../utils')

const ManagerDao = require('./ManagerDao')

class Manager {
  constructor({
    projectId, pulseCore, sheetData, sheetName, timestamp, hashType = 'ptps'
  }) {

    this.pulseCore = pulseCore
    this.projectId = ObjectId(projectId)

    this.sheetData = sheetData
    this.sheetName = sheetName
    this.managerDao = new ManagerDao({ db: pulseCore })

    // create JS Date Object (which only stores dates in absolute UTC time) as the UTC equivalent of isoShortString in New York time
    this.setTimeZone(timestamp)

    // Set default hasher 
    this.payerCombinationHasher = payerCombinationHasher(hashType)
  }

  setTimeZone(timestamp) {
    this.timestamp = zonedTimeToUtc(timestamp, DEFAULT_TIMEZONE)
  }

  async setOrgsHashBySlug(setOrgs) {
    const orgs = setOrgs || await this.managerDao.getOrgsOp()
    this.orgsHashBySlug = _.keyBy(orgs, 'slug')
  }

  async setEnrichedPtps(setEnrichedPtps) {
    const enrichedPtps = setEnrichedPtps || await this.managerDao.getEnrichedPtps()
    this.enrichedPtpsByCombo = _.groupBy(enrichedPtps, this.payerCombinationHasher)
  }

  async setQualityOfAccessHash(setQualityOfAccesses) {
    const qualityOfAccesses = setQualityOfAccesses || await this.managerDao.getAccessesOp()
    this.qualityOfAccessHash = _.keyBy(qualityOfAccesses, 'access')
  }

  async setupHashes() {
    await this.setOrgsHashBySlug()
    await this.setEnrichedPtps()
    await this.setQualityOfAccessHash()
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

  async upsertOrgTpHistory() {
    // 1.  wait on setup steps to complete
    await this.setupHashes()

    // 2. use hashes made during setup to getPermittedOps
    const permittedOps = await this.getPermittedOps()

    // 3. run upsert logic
    const ops = permittedOps
      .map(({ findObj, setObj }) => (
        this.pulseCore
          .collection('organizations.treatmentPlans.history')
          .updateOne(findObj, setObj, { upsert: true })
      ))

    return Promise.all(ops)
  }
}

module.exports = Manager
