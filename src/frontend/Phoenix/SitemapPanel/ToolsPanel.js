import React from 'react'
import ButtonGroup from './shared/ButtonGroup'
import Panel from '../../components/Panel'

import {
  GET_SOURCE_TOOLS,
  GET_SELECTED_TOOL,
} from '../../api/queries'

import { SELECT_TOOL } from '../../api/mutations'

import {
  panelItemStyle,
  panelItemActiveStyle,
  panelHeaderStyle,
  panelTitleStyle,
  defaultPanelStyle,
} from './shared/panelStyles'

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
      titleStyle={panelTitleStyle}
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
