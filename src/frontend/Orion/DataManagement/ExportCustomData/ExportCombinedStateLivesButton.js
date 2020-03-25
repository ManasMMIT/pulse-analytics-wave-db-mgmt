import React from 'react'
import _ from 'lodash'

import ExportExcelButton from '../../../components/ExportExcelButton'

// TODO 1: send treatmentPlan to backend resolver for data

// TODO 2: disable button if
// * 1. data for treatmentPlan is still loading,
// * 2. returned data from treatmentPlan is empty (nothing found)
// ! for #2 case, display a helpful message on frontend,
// ! disabling already happens under the hood in the ExportButton component

const ExportCombinedStateLivesButton = ({
  treatmentPlan,
}) => {
  if (!treatmentPlan || _.isEmpty(treatmentPlan)) return null

  return (
    <ExportExcelButton
      data={[]}
      filename={'Test'}
    >
      Export me
    </ExportExcelButton>
  )
}

export default ExportCombinedStateLivesButton
