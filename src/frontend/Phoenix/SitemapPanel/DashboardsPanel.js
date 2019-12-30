import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { transparentize } from 'polished'

import {
  GET_TOOL_DASHBOARDS,
  GET_SELECTED_DASHBOARD,
  GET_SELECTED_TOOL,
} from '../../api/queries'

import { SELECT_DASHBOARD } from '../../api/mutations'

import Panel from '../shared/Panel'
import ButtonGroup from './shared/ButtonGroup'

const defaultPanelStyle = {
  padding: 20,
}

const panelHeaderStyle = {
  color: '#0E2539',
  fontWeight: 600,
}

const panelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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

const DashboardsPanel = ({
  handleToggle,
  dashboardsStatus,
}) => {
  const { data, loading } = useQuery(GET_SELECTED_TOOL)

  if (loading) return null

  const { selectedTool: { name: toolName } } = data

  const buttonGroupCallback = dashboard => (
    <ButtonGroup
      sourceEntity={dashboard}
      teamEntityNodes={dashboardsStatus}
      nodeType="dashboards"
      handleToggle={handleToggle}
    />
  )

  const label2Callback = ({ _id, name: sourceNodeName }) => {
    const teamNode = dashboardsStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

  return (
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
        label1Callback: ({ name }) => name,
        label2Callback,
      }}
    />
  )
}

export default DashboardsPanel
