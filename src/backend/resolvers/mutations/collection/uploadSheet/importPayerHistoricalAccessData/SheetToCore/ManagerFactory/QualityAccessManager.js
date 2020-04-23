const Manager = require('./Manager')

class QualityAccessManager extends Manager {
  constructor(projectConfig) { // eslint-disable-line
    super(projectConfig)
  }

  getPermittedOps() {
    const dataForOps = this.getFilteredAndEnrichedSheetData()

    return dataForOps.map(datum => {
      const {
        orgTpId,
        access,
        tier,
        tierRating,
        tierTotal,
        treatmentPlanId,
        organizationId,
      } = datum

      const setObj = {
        $set: {
          orgTpId,
          treatmentPlanId,
          organizationId,
          timestamp: this.timestamp,
          accessData: this.qualityOfAccessHash[access], // ! but what if there's no match? top validation layer should catch this
          tierData: {
            tier,
            tierRating,
            tierTotal,
          }
        },
      }

      return ({
        findObj: {
          orgTpId,
          timestamp: this.timestamp,
        },
        setObj,
      })
    })
  }
}

module.exports = QualityAccessManager
