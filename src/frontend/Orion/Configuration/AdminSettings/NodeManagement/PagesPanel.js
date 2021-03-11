import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import queryString from 'query-string'

import { GET_SOURCE_NODES } from 'frontend/api/queries'
import PanelHeader from 'frontend/components/Panel/PanelHeader'
import NodeMgmtPanelItem from './shared/NodeMgmtPanelItem/NodeMgmtPanelItem'
import {
  defaultPanelStyle,
  panelHeaderStyle,
  panelTitleStyle,
} from 'frontend/Phoenix/SitemapPanel/shared/panelStyles'
import CreateModalButton from './shared/CreateModalButton/CreateModalButton'

const getNodeIds = (page, nodes) => {
  const pageId = page._id
  const card =
    nodes.find(
      ({ type, parentId }) => type === 'card' && parentId === pageId
    ) || {}
  const cardId = card._id
  const dashboardId = page.parentId
  const dashboard =
    nodes.find(
      ({ type, _id }) => type === 'dashboard' && _id === dashboardId
    ) || {}
  const toolId = dashboard.parentId

  return {
    toolId,
    dashboardId,
    pageId,
    cardId,
  }
}

const PANEL_TITLE = 'Pages'

const PagesPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const locationSearch =
    (location.search && queryString.parse(location.search)) || {}

  const {
    dashboardId: selectedDashboardId,
    pageId: selectedPageId,
  } = locationSearch

  const { data, loading } = useQuery(GET_SOURCE_NODES)

  const handleClick = (page) => {
    history.push({
      search: queryString.stringify(getNodeIds(page, data.nodes)),
    })
  }

  useEffect(() => {
    if (selectedDashboardId && !selectedPageId && !loading) {
      const firstPage =
        data.nodes.find(
          ({ type, parentId }) =>
            type === 'page' && parentId === selectedDashboardId
        ) || {}

      handleClick(firstPage)
    }
  }, [loading])

  if (loading) return 'Loading...'

  const pages = data.nodes.filter(
    ({ type, parentId }) => type === 'page' && parentId === selectedDashboardId
  )

  return (
    <div style={{ ...defaultPanelStyle, flex: 1 }}>
      <PanelHeader
        headerContainerStyle={panelHeaderStyle}
        title={PANEL_TITLE}
        titleStyle={panelTitleStyle}
      >
        <CreateModalButton isEnabled={selectedDashboardId} type="page" />
      </PanelHeader>

      <div>
        {pages.map((page) => (
          <NodeMgmtPanelItem
            key={page._id}
            isSelected={page._id === selectedPageId}
            node={page}
            handleClick={() => handleClick(page)}
          />
        ))}
      </div>
    </div>
  )
}

export default PagesPanel
