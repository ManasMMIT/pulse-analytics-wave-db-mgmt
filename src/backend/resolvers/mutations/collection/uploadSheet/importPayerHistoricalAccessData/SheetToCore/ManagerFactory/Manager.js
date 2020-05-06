const { ObjectId } = require('mongodb')
const _ = require('lodash')

const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../../../utils/defaultTimeZone')

const {
  ENRICH_ORG_TP_PIPELINE,
} = require('../agg-pipelines')

const {
  payerCombinationHasher
} = require('../../utils')

class Manager {
  constructor({
    projectId, pulseCore, sheetData, sheetName, timestamp, hashType = 'ptps'
  }) {

    this.pulseCore = pulseCore
    this.projectId = ObjectId(projectId)

    this.sheetData = sheetData
    this.sheetName = sheetName

    // create JS Date Object (which only stores dates in absolute UTC time) as the UTC equivalent of isoShortString in New York time
    this.setTimeZone(timestamp)

    // Set default hasher 
    this.payerCombinationHasher = payerCombinationHasher(hashType)
  }

  async getOrgsOp() {
    return await this.pulseCore
      .collection('organizations')
      .find({ type: 'Payer' })
      .toArray()
  }

  async getEnrichedPtps() {
    return await this.pulseCore
      .collection('organizations.treatmentPlans')
      .aggregate(ENRICH_ORG_TP_PIPELINE)
      .toArray()
  }

  async getAccessesOp() {
    return await this.pulseCore
      .collection('qualityOfAccessScore')
      .find()
      .toArray()
  }

  setTimeZone(timestamp) {
    this.timestamp = zonedTimeToUtc(timestamp, DEFAULT_TIMEZONE)
  }

  async setupHashes() {
    /*
      ? Note:
      Getting a hash is split into two parts for performance benefits

      1. Fetch appropriate date
      2. Group hash by desired fields
    */
    //

    const [
      orgs,
      enrichedPtps,
      qualityOfAccesses,
    ] = await Promise.all([
      this.getOrgsOp(),
      this.getEnrichedPtps(),
      this.getAccessesOp(),
    ])

    this.orgsHashBySlug = _.keyBy(orgs, 'slug')

    this.enrichedPtpsByCombo = _.groupBy(enrichedPtps, this.payerCombinationHasher)
    this.qualityOfAccessHash = _.keyBy(qualityOfAccesses, 'access')
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
