const _ = require('lodash')

const {
  ENRICH_ORG_TP_PIPELINE,
} = require('../agg-pipelines')

class ManagerDao {
  constructor({ db }) {

    this.db = db

  }

  async getOrgsOp() {
    try {
      return await this.db 
        .collection('organizations')
        .find({ type: 'Payer' })
        .toArray()
    } catch (e) {
      console.error(`Unable to get Orgs Ops: ${e}`)
      return { error: e }
    }
  }

  async getEnrichedPtps() {
    try {
      return await this.db
        .collection('organizations.treatmentPlans')
        .aggregate(ENRICH_ORG_TP_PIPELINE)
        .toArray()
    } catch (e) {
      console.error(`Unable to get enriched ptps: ${e}`)
      return { error: e }
    }
  }

  async getAccessesOp() {
    try {
      return this.db
        .collection('qualityOfAccessScore')
        .find()
        .toArray()
    } catch (e) {
      console.error(`Unable to get accesses ops: ${e}`)
      return { error: e }
    }
  }

  async upsertOrgTpHistory(permittedOps) {
    try {
      const ops = permittedOps
        .map(({ findObj, setObj }) => (
          this.pulseCore
            .collection('organizations.treatmentPlans.history')
            .updateOne(findObj, setObj, { upsert: true })
        ))
  
      return Promise.all(ops)
    } catch (e) {
      console.error(`Unable to upsert orgTp history: ${e}`)
      return { error: e }
    }
  }
}

module.exports = ManagerDao