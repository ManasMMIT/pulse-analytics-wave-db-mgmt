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
    { loading }
  ] = useLazyQuery(
    GET_PAYER_COMBINED_DRG_STATE_LIVES,
    {
      variables: { treatmentPlan },
      onCompleted: data => {
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
    }
  )

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) loadCombinedDrgStateLivesData()
  }, [treatmentPlan])

  return (
    <ExportExcelButton
      data={exportData}
      isDisabled={_.isEmpty(exportData) || loading}
      filename={`${SOURCE}_Lives-${ treatmentPlanLabel }`}
      sheetName={'State Sheet'}
    >
      { loading ? <Spinner /> : 'Export State Sheet' }
    </ExportExcelButton>
  )
}

export default ExportCombinedStateLivesButton
