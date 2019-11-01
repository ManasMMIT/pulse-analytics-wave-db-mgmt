// this util strips out all fields except _id from
// the nested treatmentPlans array

const trimTreatmentPlansToIds = treatmentPlans => {
  const result = treatmentPlans.map(treatmentPlan => {
    let { _id: treatId } = treatmentPlan

    let regimens = []
    if (treatmentPlan.regimens && treatmentPlan.regimens.length) {
      regimens = treatmentPlan.regimens.map(regimen => {
        let { _id: regId } = regimen

        return { _id: regId }
      })
    }

    return { _id: treatId, regimens }
  })

  return result
}

export default trimTreatmentPlansToIds
