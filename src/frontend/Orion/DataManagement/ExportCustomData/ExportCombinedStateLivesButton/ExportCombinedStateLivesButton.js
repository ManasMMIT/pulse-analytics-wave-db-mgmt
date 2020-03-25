import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ExportExcelButton from '../../../../components/ExportExcelButton'
import Spinner from './../../../../Phoenix/shared/Spinner'

import {
  GET_PAYER_COMBINED_DRG_STATE_LIVES
} from './../../../../api/queries'

import getCombinedStateLivesExportData from './getCombinedStateLivesExportData'

const SOURCE = 'DRG'
const TERRITORY_TYPE = 'states'

const ExportCombinedStateLivesButton = ({
  treatmentPlan,
}) => {
  const { _id, ...tpFields } = treatmentPlan
  const treatmentPlanLabel = Object.values(tpFields).join(' - ')

  const [exportData, setExportData] = useState([])

  const [
    loadCombinedDrgStateLivesData,
    { data, loading }
  ] = useLazyQuery(
    GET_PAYER_COMBINED_DRG_STATE_LIVES,
    {
      variables: { treatmentPlan },
    }
  )

  // ! careful balancing act between useEffects...

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) loadCombinedDrgStateLivesData()
  }, [treatmentPlan])

  useEffect(() => {
    if (!loading && data) {

      if (_.isEmpty(data.payerCombinedStateLives[0])) {
        setExportData([])
      } else if (data.payerCombinedStateLives[0]) {
        const formattedDataForExport = getCombinedStateLivesExportData(
          data.payerCombinedStateLives[0],
          SOURCE,
          TERRITORY_TYPE,
        )

        setExportData(formattedDataForExport)
      }
    }
  }, [loading, data])

  const isDisabled = (_.isEmpty(exportData) || loading)

  const isDisabledBecauseNoDataToExport = (
    !loading
    && data !== undefined
    && _.isEmpty(data.payerCombinedStateLives)
  )

  return (
    <>
      <ExportExcelButton
        data={exportData}
        isDisabled={isDisabled}
        filename={`${SOURCE}_Lives-${ treatmentPlanLabel }`}
        sheetName={'State Sheet'}
      >
        { loading ? <Spinner /> : 'Export State Sheet' }
      </ExportExcelButton>
      {
        isDisabledBecauseNoDataToExport && (
          <div style={{ color: 'red' }}>
            This treatment plan does not have state lives data
          </div>
        )
      }
    </>
  )
}

export default ExportCombinedStateLivesButton
