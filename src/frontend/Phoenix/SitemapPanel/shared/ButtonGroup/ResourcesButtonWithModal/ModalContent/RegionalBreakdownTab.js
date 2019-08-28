import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'

const RegionalBreakdownTab = ({
  nodeId,
  nodeType,
  resources: { regionalBreakdown },
  handlers: { handleRegBrkToggle },
  teamEntityNodes,
}) => {
  let checked = false

  const teamResources = teamEntityNodes[nodeId].resources

  if (teamResources && teamResources.regionalBreakdown) {
    checked = true
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

RegionalBreakdownTab.defaultProps = {
  nodeId: undefined,
  nodeType: undefined,
  resources: {
    regionalBreakdown: undefined,
  },
  handlers: {
    handleRegBrkToggle: undefined,
  },
  teamEntityNodes: {},
}

RegionalBreakdownTab.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  resources: PropTypes.object,
  handlers: PropTypes.object,
  teamEntityNodes: PropTypes.object,
}

export default RegionalBreakdownTab
