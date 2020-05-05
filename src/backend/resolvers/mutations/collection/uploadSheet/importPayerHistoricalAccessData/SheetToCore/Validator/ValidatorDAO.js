const _ = require('lodash')
const {
  getProjectOrgTpsEnrichedPipeline,
} = require('../agg-pipelines')

class ValidatorDAO {
  constructor(db) {
    this.db = db
  }

  async getAllowedPtpsHash(hasher) {
    try {
      const allowedOrgTpCombos = await this.db
        .collection('tdgProjects')
        .aggregate(
          getProjectOrgTpsEnrichedPipeline(this.projectId)
        )
        .toArray()
  
      return _.keyBy(allowedOrgTpCombos, hasher)
    } catch(e) {
      console.log(`getAllowedPtpsHash: ${ e }`)
      return null
    }
  }
}

export default ValidatorDAO