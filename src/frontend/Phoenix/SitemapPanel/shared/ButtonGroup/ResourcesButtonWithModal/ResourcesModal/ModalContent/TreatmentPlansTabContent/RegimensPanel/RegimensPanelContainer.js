import React from 'react'
import _ from 'lodash'

import RegimensPanel from './RegimensPanel'

const RegimensPanelContainer = ({
  selectedIndicationId,
  baseTreatmentPlans,
  setStagedTreatmentPlans,
  enabledTreatmentPlansHash,
  enabledTreatmentPlans,
}) => {
  const copyInd = _.cloneDeep(
    baseTreatmentPlans.find(({ _id }) => _id === selectedIndicationId)
  )

  const enabledRegimensHash = enabledTreatmentPlansHash[copyInd._id]

  const targetInd = enabledTreatmentPlans.find(({ _id }) => _id === copyInd._id)
  const isSelectedIndEnabled = Boolean(targetInd)

  const enableRegimen = regObj => {
    const copyReg = _.cloneDeep(regObj)

    if (!isSelectedIndEnabled) {
      // replace all base regimens with just the one that was toggled on
      copyInd.regimens = [copyReg]

      enabledTreatmentPlans = enabledTreatmentPlans.concat([copyInd])
    } else {
      targetInd.regimens = targetInd.regimens.concat([copyReg])
    }

    setStagedTreatmentPlans(enabledTreatmentPlans)
  }

  const disableRegimen = regObj => {
    const targetRegIdx = targetInd.regimens.findIndex(
      ({ _id }) => _id === regObj._id
    )

    targetInd.regimens.splice(targetRegIdx, 1)

    setStagedTreatmentPlans(enabledTreatmentPlans)
  }

  let enabledRegimens = []
  // targetInd.regimens has already been ordered appropriately
  if (isSelectedIndEnabled) enabledRegimens = targetInd.regimens

  const disabledRegimens = copyInd.regimens.filter(
    ({ _id }) => !enabledRegimensHash || !enabledRegimensHash[_id]
  )

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const [removedItem] = enabledRegimens.splice(oldIndex, 1)
    enabledRegimens.splice(newIndex, 0, removedItem)

    targetInd.regimens = enabledRegimens // this prob isn't needed as targetInd.regimens likely is mutated at this point
    setStagedTreatmentPlans(enabledTreatmentPlans)
  }

  return (
    <RegimensPanel
      selectedIndicationName={copyInd.name}
      enabledRegimens={enabledRegimens}
      disabledRegimens={disabledRegimens}
      enableRegimen={enableRegimen}
      disableRegimen={disableRegimen}
      onSortEnd={onSortEnd}
    />
  )
}

export default RegimensPanelContainer
