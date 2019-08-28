import React from 'react'
import { transparentize } from 'polished'
import Switch from '@material-ui/core/Switch'
import ToolsResourcesButton from './ToolsResourcesButton'

import Panel from '../../shared/Panel'
import {
  GET_SOURCE_TOOLS,
  GET_SELECTED_TOOL,
} from '../../../api/queries'

import { SELECT_TOOL } from '../../../api/mutations'

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

const buttonGroupWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
}

const ToolsPanel = ({ handleToggle, toolsStatus }) => {
  const buttonGroupCallback = tool => {
    const teamToolResources = toolsStatus[tool._id]
      && toolsStatus[tool._id].resources

    return (
      <div style={buttonGroupWrapperStyle}>
        {
          teamToolResources && (
            <ToolsResourcesButton
              resources={teamToolResources}
            />
          )
        }
        <Switch
          key={tool._id}
          checked={Boolean(toolsStatus[tool._id])}
          color="primary"
          onChange={e => (
            handleToggle({
              type: 'tools',
              _id: e.target.value,
              node: e.target.checked && tool,
            })
          )}
          value={tool._id}
        />
      </div>
    )
  }

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
