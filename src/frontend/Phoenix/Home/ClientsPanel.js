import React from 'react'
import Panel from '../shared/Panel'
import TextFormButton from '../shared/TextForm/Button'

import { CREATE_CLIENT, SELECT_CLIENT } from '../../api/mutations'
import { GET_CLIENTS, GET_SELECTED_CLIENT } from '../../api/queries'

const CREATE_BUTTON_TXT = 'Create Client'

const CREATE_MODAL_TITLE = 'Create New Client'

const createButtonStyle = {
  background: "#234768",
  color: 'white',
}

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

const ClientsPanel = () => {
  const createButton = (
    <TextFormButton
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={createButtonStyle}
      mutationDoc={CREATE_CLIENT}
    />
  )

  return (
    <Panel
      style={{ backgroundColor: '#0a3557' }}
      title="Clients"
      titleStyle={{ color: '#536f8d' }}
      createButton={createButton}
      queryDocs={{
        fetchAllQueryProps: { query: GET_CLIENTS },
        fetchSelectedQueryProps: { query: GET_SELECTED_CLIENT },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default ClientsPanel
