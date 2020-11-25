import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ExportExcelButton from '../../../../components/ExportExcelButton'
import Spinner from 'frontend/components/Spinner'

import { StyledButton } from '../../styledComponents'
import FontSpace from '../../../../utils/fontspace'
import Color from '../../../../utils/color'
import { GET_REGIONAL_TARGETING_DATA } from '../../../../api/queries'

const ExportButtons = ({
  treatmentPlan,
  selectedTeamId,
  selectedLivesSource,
}) => {
  const { _id, __typename, ...tpFields } = treatmentPlan
  const treatmentPlanLabel = Object.values(tpFields).join('-')

  const [statesBreakdownData, setStatesBreakdownData] = useState([])
  const [breakdownsData, setBreakdownsData] = useState([])

  // ! it's possible data for export will fall behind dropdown selections, so keep track of exportDataTpAndTeamId
  // ! and don't let user download data if selections don't match it
  const [exportDataTpAndTeamId, setExportDataTpAndTeamId] = useState({})

  const [loadRegionalTargetingData, { data, loading }] = useLazyQuery(
    GET_REGIONAL_TARGETING_DATA,
    {
      onError: (error) => {
        alert(error)
        setExportDataTpAndTeamId({})
        setStatesBreakdownData([])
        setBreakdownsData([])
      },
    }
  )

  useEffect(() => {
    if (!loading && data) {
      const {
        statesExportData,
        breakdownsExportData,
        treatmentPlan: exportDataTp,
        teamId: exportDataTeamId,
      } = data.regionalTargetingData

      if (statesExportData) setStatesBreakdownData(statesExportData)
      if (breakdownsExportData) setBreakdownsData(breakdownsExportData)

      if (exportDataTp && exportDataTeamId) {
        setExportDataTpAndTeamId({ ...exportDataTp, teamId: exportDataTeamId })
      }
    }
  }, [loading, data])

  const isExportDataBehindDropdowns = !_.isEqual(exportDataTpAndTeamId, {
    ...tpFields,
    teamId: selectedTeamId,
  })

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
                livesSource: selectedLivesSource,
              },
            },
          })
        }}
      >
        {loading ? <Spinner /> : 'Generate Data for Download'}
      </StyledButton>

      <div style={{ marginTop: 16, color: Color.RED, ...FontSpace.FS2 }}>
        Note: All lives are DRG lives, and regional breakdown sheets only become
        downloadable if the selected team has regional breakdown data.
      </div>
      <div style={{ marginTop: 16, color: Color.RED, ...FontSpace.FS2 }}>
        <sup>*</sup> Make sure team has <u>at least a single user</u> before
        exporting data.
      </div>

      <div style={{ display: 'flex' }}>
        <ExportExcelButton
          data={statesBreakdownData}
          isDisabled={
            _.isEmpty(statesBreakdownData) || isExportDataBehindDropdowns
          }
          filename={`${selectedLivesSource}_State_Lives-${treatmentPlanLabel}_${selectedTeamId}`}
          sheetName={'State Sheet'}
        >
          Download State Sheet
        </ExportExcelButton>

        {breakdownsData.map(({ type, data }) => {
          const typeLabel = _.startCase(type)

          return (
            <div style={{ marginLeft: 16 }}>
              <ExportExcelButton
                data={data}
                isDisabled={_.isEmpty(data) || isExportDataBehindDropdowns}
                filename={`${selectedLivesSource}_${typeLabel}_Lives-${treatmentPlanLabel}_${selectedTeamId}`}
                sheetName={`${typeLabel} Sheet`}
              >
                Download {typeLabel} Sheet
              </ExportExcelButton>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExportButtons
