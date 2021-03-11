import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import queryString from 'query-string'

import { GET_SOURCE_NODES } from 'frontend/api/queries'
import PanelHeader from 'frontend/components/Panel/PanelHeader'
import {
  defaultPanelStyle,
  panelHeaderStyle,
  panelTitleStyle,
} from 'frontend/Phoenix/SitemapPanel/shared/panelStyles'
import NodeMgmtPanelItem from './shared/NodeMgmtPanelItem/NodeMgmtPanelItem'
import CreateModalButton from './shared/CreateModalButton/CreateModalButton'

const PANEL_TITLE = 'Tools'

const getNodeIds = (tool, nodes) => {
  const toolId = tool._id
  const dashboard = nodes.find(({ parentId }) => parentId === toolId) || {}
  const dashboardId = dashboard._id
  const page = nodes.find(({ parentId }) => parentId === dashboardId) || {}
  const pageId = page._id
  const card = nodes.find(({ parentId }) => parentId === pageId) || {}
  const cardId = card._id

  return {
    toolId,
    dashboardId,
    pageId,
    cardId,
  }
}

const ToolsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const selectedToolId =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).toolId) ||
    ''

  const { data, loading } = useQuery(GET_SOURCE_NODES)

  const handleClick = (tool) => {
    history.push({
      search: queryString.stringify(getNodeIds(tool, data.nodes)),
    })
  }

  useEffect(() => {
    if (!selectedToolId && !loading) {
      const firstTool = data.nodes.find(({ type }) => type === 'tool')
      handleClick(firstTool)
    }
  }, [loading])

  if (loading) return 'Loading...'

  const tools = data.nodes.filter(({ type }) => type === 'tool')

  return (
    <div style={{ ...defaultPanelStyle, flex: 1 }}>
      <PanelHeader
        headerContainerStyle={panelHeaderStyle}
        title={PANEL_TITLE}
        titleStyle={panelTitleStyle}
      />
      <div>
        {tools.map((tool) => (
          <NodeMgmtPanelItem
            key={tool._id}
            isSelected={tool._id === selectedToolId}
            node={tool}
            handleClick={() => handleClick(tool)}
          />
        ))}
      </div>
    </div>
  )
}

export default ToolsPanel
