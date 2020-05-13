const Manager = require('./Manager')

class PolicyLinkManager extends Manager {
  constructor(projectConfig) { // eslint-disable-line
    super(projectConfig)
  }

  getPermittedOps() {
   const dataForOps = this.getFilteredAndEnrichedSheetData()

   return dataForOps.map(datum => {
     const {
       orgTpId,
       dateTracked,
       paLink,
       policyLink,
       siteLink,
       link,
       treatmentPlanId,
       organizationId,
     } = datum

    const updatedOn = new Date()

    const setObj = {
      $set: {
        orgTpId,
        treatmentPlanId,
        organizationId,
        projectId: this.projectId,
        timestamp: this.timestamp,
        policyLinkData: {
          dateTracked,
          link,
          paLink,
          policyLink,
          siteLink,
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

module.exports = PolicyLinkManager
