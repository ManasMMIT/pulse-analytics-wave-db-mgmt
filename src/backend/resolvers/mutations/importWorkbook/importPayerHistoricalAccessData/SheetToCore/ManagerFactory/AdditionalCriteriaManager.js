const { ObjectId } = require('mongodb')
const Manager = require('./Manager')

const _ = require('lodash')

class AdditionalCriteriaManager extends Manager {
  constructor(projectConfig) { // eslint-disable-line
    super(projectConfig)
  }

  getCriteriaData(additionalCriteriaDocs) {
    return additionalCriteriaDocs
      .map(({ criteria, criteriaNotes, restrictionLevel }) => {
        return {
          criteria, // ! but what if this or any of these are blank? current pos: let it through to expose a problem
          criteriaNotes,
          restrictionLevel
        }
      })
  }

  getPermittedOps() {
    const dataForOps = this.getFilteredAndEnrichedSheetData()

    const dataGroupedByOrgTp = _.groupBy(dataForOps, 'orgTpId')

    const updatedOn = new Date()

    return Object.keys(dataGroupedByOrgTp)
      .map(orgTpId => {
        orgTpId = ObjectId(orgTpId)

        const additionalCriteriaDocs = dataGroupedByOrgTp[orgTpId]

        const {
          treatmentPlanId,
          organizationId,
        } = additionalCriteriaDocs[0]

        const additionalCriteriaData = this.getCriteriaData(additionalCriteriaDocs)

        return {
          findObj: {
            orgTpId,
            timestamp: this.timestamp,
          },
          setObj: {
            $set: {
              orgTpId,
              projectId: this.projectId,
              treatmentPlanId,
              organizationId,
              timestamp: this.timestamp,
              additionalCriteriaData,
              updatedOn,
            },
            $setOnInsert: {
              createdOn: updatedOn,
            }
          }
        }
      })
  }
}

module.exports = AdditionalCriteriaManager
