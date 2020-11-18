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

const getNodeIds = (card, nodes) => {
  const page = nodes.find(({ _id }) => _id === card.parentId) || {}
  const dashboard = nodes.find(({ _id }) => _id === page.parentId) || {}
  const tool = nodes.find(({ _id }) => _id === dashboard.parentId) || {}

  const cardId = card._id
  const pageId = page._id
  const dashboardId = dashboard._id
  const toolId = tool._id

  return {
    toolId,
    dashboardId,
    pageId,
    cardId,
  }
}

const PANEL_TITLE = 'Cards'

const CardsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const locationSearch =
    (location.search && queryString.parse(location.search)) || {}

  const { cardId: selectedCardId, pageId: selectedPageId } = locationSearch

  const { data, loading } = useQuery(GET_SOURCE_NODES)

  const handleClick = (card) => {
    history.push({
      search: queryString.stringify(getNodeIds(card, data.nodes)),
    })
  }

  useEffect(() => {
    if (selectedPageId && !selectedCardId && !loading) {
      const card =
        data.nodes.find(
          ({ type, parentId }) => type === 'card' && parentId === selectedPageId
        ) || {}

      handleClick(card)
    }
  }, [loading])

  if (loading) return 'Loading...'

  const cards = data.nodes.filter(
    ({ type, parentId }) => type === 'card' && parentId === selectedPageId
  )

  return (
    <div style={{ ...defaultPanelStyle, flex: 1 }}>
      <PanelHeader
        headerContainerStyle={panelHeaderStyle}
        title={PANEL_TITLE}
        titleStyle={panelTitleStyle}
      >
        <CreateSourceNodeButton type="card" />
      </PanelHeader>

      <div>
        {cards.map((card) => (
          <NodeMgmtPanelItem
            key={card._id}
            isSelected={card._id === selectedCardId}
            node={card}
            handleClick={() => handleClick(card)}
          />
        ))}
      </div>
    </div>
  )
}

export default CardsPanel
