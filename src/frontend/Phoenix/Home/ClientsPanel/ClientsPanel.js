import React from 'react'

import Panel from '../../shared/Panel'
import CreateButton from './CreateButton'

import { SELECT_CLIENT } from '../../../api/mutations'
import { GET_CLIENTS, GET_SELECTED_CLIENT } from '../../../api/queries'

const defaultPanelItemStyle = {
  cursor: 'pointer',
  color: '#7a97b1',
  borderLeft: '4px solid transparent',
  padding: 24,
}

const activePanelItemStyle = {
  cursor: 'default',
  backgroundColor: '#1c4161',
  color: '#ebf6fb',
  borderLeft: '4px solid #0f66d0',
}

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_CLIENT,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  label1Callback: ({ description }) => description,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const headerChildren = <CreateButton />  

const ClientsPanel = () => {
  return (
    <Panel
      style={{ backgroundColor: '#0a3557' }}
      title="Clients"
      titleStyle={{ color: '#536f8d' }}
      headerChildren={headerChildren}
      queryDocs={{
        fetchAllQueryProps: { query: GET_CLIENTS },
        fetchSelectedQueryProps: { query: GET_SELECTED_CLIENT },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default ClientsPanel
