import React from 'react'
import ListsConfigSearchBar from './ListsConfigSearchBar'
import DashboardToolPanel from './DashboardToolPanel'
import ListsPanel from './ListsPanel'
import ListItemsPanel from './ListItemsPanel'
import UpdateListItemPanel from './UpdateListItemPanel'

const ListsConfigManagement = () => {
  return (
    <div style={{ width: '100%' }}>
      <ListsConfigSearchBar />
      <div style={{ display: 'flex', height: '100vh' }}>
        <DashboardToolPanel />
        <ListsPanel />
        <ListItemsPanel />
        <UpdateListItemPanel />
      </div>
    </div>
  )
}

export default ListsConfigManagement
