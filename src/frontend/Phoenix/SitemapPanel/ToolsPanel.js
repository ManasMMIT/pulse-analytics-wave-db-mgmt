import React from 'react'
import { transparentize } from 'polished'
import Switch from '@material-ui/core/Switch'

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
  )

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
      }}
    />
  )
}

export default ToolsPanel
