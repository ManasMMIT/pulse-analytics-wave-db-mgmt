const _ = require('lodash')
const {
  getProjectOrgTpsEnrichedPipeline,
} = require('../agg-pipelines')

class ValidatorDAO {
  constructor({ db, projectId }) {
    this.db = db
    this.projectId = projectId
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

module.exports = ValidatorDAO