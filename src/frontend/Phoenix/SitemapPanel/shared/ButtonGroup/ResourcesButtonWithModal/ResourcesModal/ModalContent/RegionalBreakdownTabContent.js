import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import _ from 'lodash'

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
  nodeType,
  toolRegionalBreakdown,
  regionalBreakdown,
  setStagedRegionalBreakdown,
}) => {
  let checked = regionalBreakdown.length ? true : false

  if (_.isEmpty(toolRegionalBreakdown)) {
    return (
      <div style={{ color: 'red' }}>
        <em>Selected Tool Does Not Have a Regional Breakdown</em>
      </div>
    )
  }

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
        onChange={e => {
          e.target.checked
            ? setStagedRegionalBreakdown(toolRegionalBreakdown)
            : setStagedRegionalBreakdown([])
        }}
        color="secondary"
        value={'regionalBreakdown'}
      />
    </>
  )
}

RegionalBreakdownTabContent.defaultProps = {
  regionalBreakdown: [],
}

RegionalBreakdownTabContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  toolRegionalBreakdown: PropTypes.array,
  regionalBreakdown: PropTypes.array,
  setStagedRegionalBreakdown: PropTypes.func,
}

export default RegionalBreakdownTabContent
