import React from 'react'
import _ from 'lodash'
import IndicationsPanel from './IndicationsPanel'

const IndicationsPanelContainer = ({
  selectedIndicationId,
  selectIndication,
  enabledTreatmentPlans,
  disabledTreatmentPlans,
  setStagedTreatmentPlans,
}) => {
  const enableIndication = indObj => {
    const copyInd = _.cloneDeep(indObj)

    // if indication is just being enabled by itself, no associated regimens
    // will have been enabled yet, so overrwrite as empty array.
    copyInd.regimens = []

    enabledTreatmentPlans = enabledTreatmentPlans.concat([copyInd])

    setStagedTreatmentPlans(enabledTreatmentPlans)
  }

  const disableIndication = indObj => {
    const targetIdx = enabledTreatmentPlans.findIndex(({ _id }) => _id === indObj._id)
    enabledTreatmentPlans.splice(targetIdx, 1)
    setStagedTreatmentPlans(enabledTreatmentPlans)
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const [removedItem] = enabledTreatmentPlans.splice(oldIndex, 1)
    enabledTreatmentPlans.splice(newIndex, 0, removedItem)
    setStagedTreatmentPlans(enabledTreatmentPlans)
  }

  return (
    <IndicationsPanel
      selectedIndicationId={selectedIndicationId}
      selectIndication={selectIndication}
      enabledTreatmentPlans={enabledTreatmentPlans}
      disabledTreatmentPlans={disabledTreatmentPlans}
      enableIndication={enableIndication}
      disableIndication={disableIndication}
      onSortEnd={onSortEnd}
    />
  )
}

export default IndicationsPanelContainer
