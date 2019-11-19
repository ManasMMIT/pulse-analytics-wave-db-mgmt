import React, { useState } from 'react'
import _ from 'lodash'

import IndicationsPanel from './IndicationsPanel'
import RegimensPanel from './RegimensPanel'

const TreatmentPlansTabContent = ({
  baseTreatmentPlans,
  treatmentPlans,
  setStagedTreatmentPlans,
}) => {
  const treatmentPlan = treatmentPlans[0] || {}
  const baseTreatmentPlan = baseTreatmentPlans[0] || {}

  const [selectedIndicationId, selectIndication] = useState(
    treatmentPlan._id || baseTreatmentPlan._id
  )

  const enabledTreatmentPlansHash = _.mapValues(
    _.keyBy(treatmentPlans, '_id'),
    ({ regimens }) => _.keyBy(regimens, '_id')
  )

  // separate base data into enabled tps from disabled tps
  let [enabledTreatmentPlans, disabledTreatmentPlans] = _.partition(
    baseTreatmentPlans,
    ({ _id }) => enabledTreatmentPlansHash[_id]
  )

  // need to clone otherwise partition results holds ref to baseTreatmentPlans
  enabledTreatmentPlans = _.cloneDeep(enabledTreatmentPlans)

  // sort indications top-level in enabledTreatmentPlans
  enabledTreatmentPlans = _.sortBy(enabledTreatmentPlans, [
    ({ _id }) => treatmentPlans.findIndex(({ _id: indId }) => indId === _id)
  ])

  // filter + sort the regimens slice within each indObj in enabledTreatmentPlans
  enabledTreatmentPlans.forEach(indObj => {
    // filter regimens options down to what's in the hash
    indObj.regimens = indObj.regimens.filter(({ _id }) => {
      return enabledTreatmentPlansHash[indObj._id][_id]
    })

    // sort regimens options to match team's ordering
    const indObjFromTeam = treatmentPlans.find(({ _id }) => _id === indObj._id)
    const regimensFromTeam = indObjFromTeam.regimens

    indObj.regimens = _.sortBy(indObj.regimens, [
      ({ _id }) => regimensFromTeam.findIndex(({ _id: regId }) => regId === _id)
    ])
  })

  return (
    <div style={{ display: 'flex' }}>
      <IndicationsPanel
        selectedIndicationId={selectedIndicationId}
        selectIndication={selectIndication}
        enabledTreatmentPlans={enabledTreatmentPlans}
        disabledTreatmentPlans={disabledTreatmentPlans}
        setStagedTreatmentPlans={setStagedTreatmentPlans}
      />

      <div style={{ flex: 1 }} />

      <RegimensPanel
        selectedIndicationId={selectedIndicationId}
        baseTreatmentPlans={baseTreatmentPlans}
        setStagedTreatmentPlans={setStagedTreatmentPlans}
        enabledTreatmentPlansHash={enabledTreatmentPlansHash}
        enabledTreatmentPlans={enabledTreatmentPlans}
      />
    </div>
  )
}

export default TreatmentPlansTabContent
