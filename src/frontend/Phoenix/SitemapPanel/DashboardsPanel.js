import React from 'react'
import { Query } from 'react-apollo'
import { transparentize } from 'polished'
import Switch from '@material-ui/core/Switch'

import Panel from '../shared/Panel'
import {
  GET_TOOL_DASHBOARDS,
  GET_SELECTED_DASHBOARD,
  GET_SELECTED_TOOL,
} from '../../api/queries'

import { SELECT_DASHBOARD } from '../../api/mutations'

const defaultPanelStyle = {
  padding: 20,
}

const panelHeaderStyle = {
  color: '#0E2539',
  fontWeight: 600,
}

const panelItemStyle = {
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  backgroundColor: transparentize(0.95, '#0E2539'),
  marginTop: 10,
  cursor: 'pointer',
}

const panelItemActiveStyle = {
  backgroundColor: transparentize(0.9, '#0668D9'),
  color: '#0668D9',
}

const DashboardsPanel = ({ handleToggle, dashboardsStatus }) => {
  const buttonGroupCallback = dashboard => (
    <Switch
      key={dashboard._id}
      checked={Boolean(dashboardsStatus[dashboard._id])}
      color="primary"
      onChange={e => (
        handleToggle({
          type: 'dashboards',
          _id: e.target.value,
          node: e.target.checked && dashboard,
        })
      )}
      value={dashboard._id}
    />
  )

  return (
    <Query query={GET_SELECTED_TOOL}>
      {({ data: { selectedTool: { name: toolName } } }) => (
          <Panel
            style={defaultPanelStyle}
            headerContainerStyle={panelHeaderStyle}
            title={`DASHBOARDS / ${toolName}`}
            titleStyle={{ fontSize: 16 }}
            queryDocs={{
              fetchAllQueryProps: { query: GET_TOOL_DASHBOARDS },
              fetchSelectedQueryProps: { query: GET_SELECTED_DASHBOARD },
            }}
            panelItemConfig={{
              selectEntityMutationDoc: SELECT_DASHBOARD,
              style: panelItemStyle,
              activeStyle: panelItemActiveStyle,
              buttonGroupCallback,
            }}
          />
      )}
    </Query>
  )
}

export default DashboardsPanel
