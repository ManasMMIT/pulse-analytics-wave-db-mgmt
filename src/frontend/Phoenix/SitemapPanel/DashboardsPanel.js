import React from 'react'
import { useQuery } from '@apollo/client'

import {
  GET_TOOL_DASHBOARDS,
  GET_SELECTED_DASHBOARD,
  GET_SELECTED_TOOL,
} from '../../api/queries'

import { SELECT_DASHBOARD } from '../../api/mutations'

import Panel from '../../components/Panel'
import ButtonGroup from './shared/ButtonGroup'

import {
  panelItemStyle,
  panelItemActiveStyle,
  panelHeaderStyle,
  panelTitleStyle,
  defaultPanelStyle,
} from './shared/panelStyles'

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
      titleStyle={panelTitleStyle}
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
