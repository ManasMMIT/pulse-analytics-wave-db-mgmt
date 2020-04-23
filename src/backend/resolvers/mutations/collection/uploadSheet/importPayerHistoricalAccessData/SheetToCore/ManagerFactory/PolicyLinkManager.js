const Manager = require('./Manager')
const _ = require('lodash')

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
       project,
       siteLink,
       link,
       treatmentPlanId,
       organizationId,
     } = datum

    const setObj = {
      $set: {
        orgTpId,
        treatmentPlanId,
        organizationId,
        timestamp: this.timestamp,
        policyLinkData: {
          dateTracked,
          link,
          paLink,
          policyLink,
          project,
          siteLink,
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

module.exports = PolicyLinkManager
