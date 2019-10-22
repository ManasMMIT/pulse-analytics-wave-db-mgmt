import React from 'react'
import _ from 'lodash'

import TreatmentPlansTabContent from './TreatmentPlansTabContent'

const TreatmentPlansTabContentContainer = ({
  baseTreatmentPlans,
  treatmentPlans,
  setStagedTreatmentPlans,
}) => {
  const enabledTreatmentPlansHash = _.mapValues(
    _.keyBy(treatmentPlans, '_id'),
    ({ regimens }) => _.keyBy(regimens, '_id')
  )

  const enableIndication = indObj => {
    const copyInd = _.cloneDeep(indObj)

    // if indication is just being enabled by itself, no associated regimens
    // will have been enabled yet, so overrwrite as empty array.
    copyInd.regimens = []

    treatmentPlans = treatmentPlans.concat([copyInd])

    setStagedTreatmentPlans(treatmentPlans)
  }

  const disableIndication = indObj => {
    const targetIdx = treatmentPlans.findIndex(({ _id }) => _id === indObj._id)
    treatmentPlans.splice(targetIdx, 1)
    setStagedTreatmentPlans(treatmentPlans)
  }

  const enableRegimen = (indObj, regObj) => {
    const copyInd = _.cloneDeep(indObj)
    const copyReg = _.cloneDeep(regObj)

    const targetInd = treatmentPlans.find(({ _id }) => _id === copyInd._id)

    if (!targetInd) {
       // replace all base regimens with just the one that was toggled on
      copyInd.regimens = [copyReg]

      treatmentPlans = treatmentPlans.concat([copyInd])
    } else {
      targetInd.regimens = targetInd.regimens.concat([copyReg])
    }

    setStagedTreatmentPlans(treatmentPlans)
  }

  const disableRegimen = (indObj, regObj) => {
    const targetInd = treatmentPlans.find(({ _id }) => _id === indObj._id)
    const targetRegIdx = targetInd.regimens.findIndex(({ _id }) => _id === regObj._id)
    targetInd.regimens.splice(targetRegIdx, 1)

    setStagedTreatmentPlans(treatmentPlans)
  }

  return (
    <TreatmentPlansTabContent
      enableIndication={enableIndication}
      disableIndication={disableIndication}
      enableRegimen={enableRegimen}
      disableRegimen={disableRegimen}
      baseTreatmentPlans={baseTreatmentPlans}
      enabledTreatmentPlansHash={enabledTreatmentPlansHash}
    />
  )
}

export default TreatmentPlansTabContentContainer
