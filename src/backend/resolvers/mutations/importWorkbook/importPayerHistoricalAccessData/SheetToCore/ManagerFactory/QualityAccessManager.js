const Manager = require('./Manager')
const _ = require('lodash')

class QualityAccessManager extends Manager {
  constructor(projectConfig) { // eslint-disable-line
    super(projectConfig)
  }

  setQualityOfAccessHash(setQualityOfAccesses = []) {
    this.qualityOfAccessHash = _.keyBy(setQualityOfAccesses, 'access')
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

      // ! but what if there's no match? top validation layer should catch this
      const { createdOn, ...accessData } = this.qualityOfAccessHash[access]

      const updatedOn = new Date()

      const setObj = {
        $set: {
          orgTpId,
          treatmentPlanId,
          organizationId,
          projectId: this.projectId,
          timestamp: this.timestamp,
          accessData,
          tierData: {
            tier,
            tierRating,
            tierTotal,
          },
          updatedOn,
        },
        $setOnInsert: {
          createdOn: updatedOn,
        }
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
