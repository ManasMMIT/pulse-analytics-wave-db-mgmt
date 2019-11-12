import React from 'react'

import Panel from '../../shared/Panel'
import CreateButton from './CreateButton'

import { SELECT_CLIENT } from '../../../api/mutations'
import { GET_CLIENTS, GET_SELECTED_CLIENT } from '../../../api/queries'

const defaultPanelItemStyle = {
  cursor: 'pointer',
  color: '#7a97b1',
  borderLeft: '4px solid transparent',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.2px',
  lineHeight: '20px',
  padding: '12px 24px',
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

const panelBackgroundColor = '#093357'

const ClientsPanel = () => {
  return (
    <Panel
      style={{ backgroundColor: panelBackgroundColor, maxWidth: 254 }}
      title="Clients"
      titleStyle={{ color: '#536f8d' }}
      headerChildren={headerChildren}
      headerContainerStyle={{ backgroundColor: panelBackgroundColor }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_CLIENTS },
        fetchSelectedQueryProps: { query: GET_SELECTED_CLIENT },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default ClientsPanel
