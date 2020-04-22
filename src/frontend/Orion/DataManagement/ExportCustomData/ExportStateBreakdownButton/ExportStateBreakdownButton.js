import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ExportExcelButton from '../../../../components/ExportExcelButton'
import Spinner from '../../../../Phoenix/shared/Spinner'

import { ErrorMessage } from '../styledComponents'

const SOURCE = 'DRG'
// const TERRITORY_TYPE = 'states'

const ExportStateBreakdownButton = ({
  treatmentPlan,
}) => {
  const { _id, ...tpFields } = treatmentPlan
  const treatmentPlanLabel = Object.values(tpFields).join(' - ')

  const loading = false
  const isDisabledBecauseNoDataToExport = false

  return (
    <div style={{ marginTop: 12 }}>
      <ExportExcelButton
        data={[]}
        isDisabled={true}
        filename={`${SOURCE}_Lives-${ treatmentPlanLabel }`}
        sheetName={'State Sheet'}
      >
        { loading ? <Spinner /> : 'Export State Sheet' }
      </ExportExcelButton>
      {
        isDisabledBecauseNoDataToExport && (
          <ErrorMessage>
            This treatment plan does not have state lives data. Select another treatment plan or contact Pulse for more details.
          </ErrorMessage>
        )
      }
    </div>
  )
}

export default ExportStateBreakdownButton
