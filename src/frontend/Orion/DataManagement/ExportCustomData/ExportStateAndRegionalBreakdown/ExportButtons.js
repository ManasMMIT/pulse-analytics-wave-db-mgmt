import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ExportExcelButton from '../../../../components/ExportExcelButton'
import Spinner from '../../../../Phoenix/shared/Spinner'

import { StyledButton } from '../styledComponents'
import FontSpace from '../../../../utils/fontspace'
import Color from '../../../../utils/color'
import { GET_REGIONAL_TARGETING_DATA } from '../../../../api/queries'

const LIVES_SOURCE = 'DRG'

const ExportButtons = ({
  treatmentPlan,
  selectedTeamId,
}) => {
  const { _id, __typename, ...tpFields } = treatmentPlan
  const treatmentPlanLabel = Object.values(tpFields).join('-')

  const [statesBreakdownData, setStatesBreakdownData] = useState([])
  const [regionalBreakdownData, setRegionalBreakdownData] = useState([])

  // ! it's possible data for export will fall behind dropdown selections, so keep track of exportDataTpAndTeamId
  // ! and don't let user download data if selections don't match it
  const [exportDataTpAndTeamId, setExportDataTpAndTeamId] = useState({}) 

  const [
    loadRegionalTargetingData,
    { data, loading }
  ] = useLazyQuery(
    GET_REGIONAL_TARGETING_DATA,
    {
      onError: error => {
        alert(error)
        setExportDataTpAndTeamId({})
        setStatesBreakdownData([])
        setRegionalBreakdownData([])
      },
    }
  )

  useEffect(() => {
    if (!loading && data) {
      const { 
        statesExportData, 
        regionalExportData, 
        treatmentPlan: exportDataTp,
        teamId: exportDataTeamId,
      } = data.regionalTargetingData

      if (statesExportData) setStatesBreakdownData(statesExportData)
      if (regionalExportData) setRegionalBreakdownData(regionalExportData)
      
      if (exportDataTp && exportDataTeamId) {
        setExportDataTpAndTeamId({ ...exportDataTp, teamId: exportDataTeamId })
      }
    }
  }, [loading, data])

  const isExportDataBehindDropdowns = !_.isEqual(
    exportDataTpAndTeamId, 
    { ...tpFields, teamId: selectedTeamId }
  )

  return (
    <div style={{ marginTop: 24 }}>
      <StyledButton 
        size="small"
        disabled={_.isEmpty(selectedTeamId) || _.isEmpty(tpFields)}
        onClick={() => {
            loadRegionalTargetingData({
              variables: {
                input: {
                  treatmentPlan: tpFields,
                  teamId: selectedTeamId,
                  livesSource: LIVES_SOURCE,
                }
              }
            })
          }}
      >
        {loading ? <Spinner /> : 'Generate Data for Download'}
      </StyledButton>

      <div style={{ marginTop: 16, color: Color.RED, ...FontSpace.FS2 }}>
          Note: All lives are DRG lives, and regional sheet only becomes downloadable if the selected team has regional data. 
      </div>

      <div style={{ display: 'flex' }}>
        <ExportExcelButton
            data={statesBreakdownData}
            isDisabled={_.isEmpty(statesBreakdownData) || isExportDataBehindDropdowns}
            filename={`${LIVES_SOURCE}_State_Lives-${treatmentPlanLabel}_${selectedTeamId}`}
            sheetName={'State Sheet'}
          >
            Download State Sheet
        </ExportExcelButton>

        <div style={{ marginLeft: 16 }} />

        <ExportExcelButton
            data={regionalBreakdownData}
            isDisabled={_.isEmpty(regionalBreakdownData) || isExportDataBehindDropdowns}
            filename={`${LIVES_SOURCE}_Regional_Lives-${treatmentPlanLabel}_${selectedTeamId}`}
            sheetName={'Regional Sheet'}
          >
            Download Regional Sheet
        </ExportExcelButton>
      </div>
    </div>
  )
}

export default ExportButtons
