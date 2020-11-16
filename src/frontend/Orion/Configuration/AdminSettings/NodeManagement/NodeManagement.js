import React from 'react'

import NodeMgmtHeader from './NodeMgmtHeader'
import ToolsPanel from './ToolsPanel'
import DashboardsPanel from './DashboardsPanel'
import PagesPanel from './PagesPanel'
import CardsPanel from './CardsPanel'

const NodeManagement = () => {
  return (
    <div style={{ flex: 1 }}>
      <NodeMgmtHeader />
      <div style={{ display: 'flex' }}>
        <ToolsPanel />
        <DashboardsPanel />
        <PagesPanel />
        <CardsPanel />
      </div>
    </div>
  )
}

export default NodeManagement
