import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Switch from '@material-ui/core/Switch'

import { GET_SELECTED_TOOL } from './../../../../../../api/queries'

const RegionalBreakdownTabContent = ({
  nodeId,
  nodeType,
  teamTools,
  resources,
  handlers: { handleRegBrkToggle },
}) => {
  let checked = false

  if (resources && resources.regionalBreakdown) {
    checked = true
  }

  return (
    <Query query={GET_SELECTED_TOOL}>
      {
        ({ data, loading }) => {
          if (loading) return null

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

          const regionalBreakdown = selectedTeamTool.resources
            && selectedTeamTool.resources.regionalBreakdown

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
      }
    </Query>
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
