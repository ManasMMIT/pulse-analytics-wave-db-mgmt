import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import { GET_SOURCE_NODES } from 'frontend/api/queries'
import PanelHeader from 'frontend/components/Panel/PanelHeader'
import {
  defaultPanelStyle,
  panelHeaderStyle,
  panelTitleStyle,
} from 'frontend/Phoenix/SitemapPanel/shared/panelStyles'
import NodeMgmtPanelItem from './shared/NodeMgmtPanelItem/NodeMgmtPanelItem'
import CreateSourceNodeButton from './shared/CreateSourceNodeButton'

const getNodeIds = (dashboard, nodes) => {
  const toolId = dashboard.parentId
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

const PANEL_TITLE = 'Dashboards'

const DashboardsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const locationSearch =
    (location.search && queryString.parse(location.search)) || {}

  const {
    toolId: selectedToolId,
    dashboardId: selectedDashboardId,
  } = locationSearch

  const { data, loading } = useQuery(GET_SOURCE_NODES)

  const handleClick = (dashboard) => {
    history.push({
      search: queryString.stringify(getNodeIds(dashboard, data.nodes)),
    })
  }

  useEffect(() => {
    if (selectedToolId && !selectedDashboardId && !loading) {
      const firstDashboard =
        data.nodes.find(
          ({ type, parentId }) =>
            type === 'dashboard' && parentId === selectedToolId
        ) || {}

      handleClick(firstDashboard)
    }
  }, [loading])

  if (loading) return 'Loading...'

  const dashboards = data.nodes.filter(
    ({ type, parentId }) => type === 'dashboard' && parentId === selectedToolId
  )

  return (
    <div style={{ ...defaultPanelStyle, flex: 1 }}>
      <PanelHeader
        headerContainerStyle={panelHeaderStyle}
        title={PANEL_TITLE}
        titleStyle={panelTitleStyle}
      >
        <CreateSourceNodeButton type="dashboard" />
      </PanelHeader>

      <div>
        {dashboards.map((dashboard) => (
          <NodeMgmtPanelItem
            key={dashboard._id}
            isSelected={dashboard._id === selectedDashboardId}
            node={dashboard}
            handleClick={() => handleClick(dashboard)}
          />
        ))}
      </div>
    </div>
  )
}

export default DashboardsPanel
