import React from 'react'
import { transparentize } from 'polished'
import ButtonGroup from './shared/ButtonGroup'
import Panel from '../shared/Panel'

import {
  GET_SOURCE_TOOLS,
  GET_SELECTED_TOOL,
} from '../../api/queries'

import { SELECT_TOOL } from '../../api/mutations'

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

const ToolsPanel = ({ handleToggle, toolsStatus }) => {
  const buttonGroupCallback = tool => (
    <ButtonGroup
      sourceEntity={tool}
      teamEntityNodes={toolsStatus}
      nodeType="tools"
      handleToggle={handleToggle}
    />
  )

  const label2Callback = ({ _id, name: sourceNodeName }) => {
    const teamNode = toolsStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

  return (
    <Panel
      style={defaultPanelStyle}
      headerContainerStyle={panelHeaderStyle}
      title="TOOLS"
      titleStyle={{ fontSize: 16 }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_SOURCE_TOOLS },
        fetchSelectedQueryProps: { query: GET_SELECTED_TOOL },
      }}
      panelItemConfig={{
        selectEntityMutationDoc: SELECT_TOOL,
        style: panelItemStyle,
        activeStyle: panelItemActiveStyle,
        buttonGroupCallback,
        label1Callback: ({ name }) => name,
        label2Callback,
      }}
    />
  )
}

export default ToolsPanel
