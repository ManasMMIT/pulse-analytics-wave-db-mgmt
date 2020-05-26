class ManagerDao {
  constructor({ db }) {
    this.db = db
  }

  async getAccessesOp() {
    try {
      return await this.db
        .collection('qualityOfAccessScore')
        .find()
        .toArray()
    } catch (e) {
      console.error(`Unable to get accesses ops: ${e}`)
      return { error: e }
    }
  }

  async upsertOrgTpHistory(
    permittedOps, session, collectionName = 'organizations.treatmentPlans.history'
  ) {
    try {
      const ops = permittedOps
        .map(({ findObj, setObj }) => (
          this.db
            .collection(collectionName)
            .updateOne(findObj, setObj, { upsert: true, session })
        ))
  
      return Promise.all(ops)
    } catch (e) {
      console.error(`Unable to upsert orgTp history: ${e}`)
      return { error: e }
    }
  }
}

module.exports = ManagerDao
