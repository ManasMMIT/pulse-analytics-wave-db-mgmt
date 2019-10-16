import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import Switch from '@material-ui/core/Switch'
import _ from 'lodash'

import { GET_SELECTED_TOOL } from './../../../../../../api/queries'

const regionWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const statesWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const contentWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-evenly',
}

const RegionalBreakdownTabContent = ({
  nodeId,
  nodeType,
  teamTools,
  resources,
  handlers: { handleRegBrkToggle },
}) => {
  const { data, loading } = useQuery(GET_SELECTED_TOOL)

  if (loading) return null

  let checked = false

  if (resources && resources.regionalBreakdown) {
    checked = true
  }

  const { selectedTool } = data
  const selectedTeamTool = teamTools[selectedTool._id]

  // ! selectedTeamTool may not exist, because it's based
  // ! on old, cached team data, not up-to-date staged team data
  if (
    !selectedTeamTool
      || !selectedTeamTool.resources
      || !selectedTeamTool.resources.regionalBreakdown
  ) {
    return (
      <div style={{ color: 'red' }}>
        <em>Selected Tool Does Not Have a Regional Breakdown</em>
      </div>
    )
  }

  const regionalBreakdown = selectedTeamTool.resources.regionalBreakdown

  if (nodeType === 'tools') {
    const groupedRegionalBreakdown = _.groupBy(
      regionalBreakdown,
      'region',
    )

    return (
      <div style={contentWrapperStyle}>
        {
          Object.keys(groupedRegionalBreakdown).map(region => {
            const stateObjsInRegion = groupedRegionalBreakdown[region]

            return (
              <div
                key={region}
                style={regionWrapperStyle}
              >
                <span style={{ fontSize: 24 }}>{region}</span>
                <div style={statesWrapperStyle}>
                  {
                    stateObjsInRegion.map(stateObj => (
                      <div key={stateObj.state}>
                        {stateObj.stateLong}
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  return (
    <>
      <span style={{ color: 'grey', fontSize: 10 }}>
        <em>Regional Breakdown</em>
      </span>
      <Switch
        checked={checked}
        onChange={e => (
          handleRegBrkToggle({
            nodeId,
            nodeType,
            regionalBreakdown,
            checked: e.target.checked,
          })
        )}
        color="secondary"
        value={'regionalBreakdown'}
      />
    </>
  )
}

RegionalBreakdownTabContent.defaultProps = {
  nodeId: undefined,
  nodeType: undefined,
  resources: {
    regionalBreakdown: undefined,
  },
  teamTools: [],
  handlers: {
    handleRegBrkToggle: undefined,
  },
}

RegionalBreakdownTabContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  resources: PropTypes.object,
  teamTools: PropTypes.object,
  handlers: PropTypes.object,
}

export default RegionalBreakdownTabContent
