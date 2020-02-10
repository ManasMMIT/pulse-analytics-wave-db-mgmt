import React, { useState } from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import IndicationsPanel from './IndicationsPanel'
import RegimensPanel from './RegimensPanel'

import { Colors, Spacing } from '../../../../../../../../utils/pulseStyles'

const ToggleButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: `${Spacing.SMALL} ${Spacing.LARGE}`,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
})

const ToggleButton = styled.button({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 10,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
  ':active': {
    outline: 'none'
  },
  ':focus': {
    outline: 'none'
  },
}, props => ({
  color: props.color,
  background: transparentize(0.85, props.color),
  ':hover': {
    background: transparentize(0.7, props.color),
  },
}))

const TreatmentPlansTabContent = ({
  baseTreatmentPlans,
  treatmentPlans,
  setStagedTreatmentPlans,
  stageAllTreatmentPlans,
  unstageAllTreatmentPlans,
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
    <div>
      <ToggleButtonContainer>
        <ToggleButton
          onClick={stageAllTreatmentPlans}
          color={Colors.GREEN}
          style={{ marginRight: Spacing.LARGE }}
        >
          Toggle on All Indications + Regimens
        </ToggleButton>
        <ToggleButton
          onClick={unstageAllTreatmentPlans}
          color={Colors.MEDIUM_GRAY_2}
        >
          Toggle off All Indications + Regimens
        </ToggleButton>
      </ToggleButtonContainer>
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
    </div>
  )
}

export default TreatmentPlansTabContent
