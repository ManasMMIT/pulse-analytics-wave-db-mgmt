const { ObjectId } = require('mongodb')

module.exports = nodeResource => {
  if (nodeResource.accounts && nodeResource.accounts.length) {
    nodeResource.accounts = nodeResource.accounts.map(({ _id }) => ({ _id: ObjectId(_id) }))
  }

  if (nodeResource.treatmentPlans && nodeResource.treatmentPlans.length) {
    nodeResource.treatmentPlans = nodeResource.treatmentPlans.map(treatmentPlan => {
      let { _id: treatId } = treatmentPlan
      treatId = ObjectId(treatId)

      let regimens = []
      if (treatmentPlan.regimens && treatmentPlan.regimens.length) {
        regimens = treatmentPlan.regimens.map(regimen => {
          let { _id: regId } = regimen
          regId = ObjectId(regId)

          return ({ _id: regId })
        })
      }

      return { _id: treatId, regimens }
    })
  }
}
