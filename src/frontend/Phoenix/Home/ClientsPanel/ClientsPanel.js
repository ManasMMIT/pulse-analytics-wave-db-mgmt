import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Panel from '../../shared/Panel'
import CreateButton from './CreateButton'
// import DeleteButton from './DeleteButton'
// import UpdateButton from './UpdateButton'

import {
  SELECT_CLIENT,
} from '../../../api/mutations'
import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
} from '../../../api/queries'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const phoenixLogo = "https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/phoenix-1-color.svg"

const ClientPanelContainer = styled.div({
  backgroundColor: Colors.TOOL_SIDEBAR,
})

const PhoenixHeader = styled.div({
  alignItems: 'center',
  background: transparentize(0.3, Colors.BLACK),
  color: Colors.PHOENIX,
  display: 'flex',
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.MEDIUM} ${Spacing.EXTRA_LARGE}`,
  textTransform: 'uppercase',
  width: '100%',
})

const PhoenixLogo = styled.img({
  display: 'inline',
  marginRight: Spacing.SMALL,
})

const defaultPanelItemStyle = {
  cursor: 'pointer',
  color: transparentize(0.4, Colors.WHITE),
  margin: `0 ${Spacing.NORMAL}`,
  borderRadius: 4,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const activePanelItemStyle = {
  color: Colors.WHITE,
  background: transparentize(0.9, Colors.WHITE),
}

const buttonGroupCallback = client => (
  <div style={{ display: 'flex' }}>
    {/* <UpdateButton client={client} /> */}
    {/* <DeleteButton clientId={client._id} /> */}
  </div>
)

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_CLIENT,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ description }) => description,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const headerChildren = <CreateButton />

const panelHeight = 'calc(100vh - 56px)'

const ClientsPanel = () => {
  return (
    <ClientPanelContainer>
      <PhoenixHeader>
        <PhoenixLogo src={phoenixLogo} />
        Phoenix User MGMT
      </PhoenixHeader>
      <Panel
        style={{
            backgroundColor: Colors.TOOL_SIDEBAR,
            maxWidth: Spacing.TOOL_SIDEBAR,
            minWidth: Spacing.TOOL_SIDEBAR,
            height: panelHeight,
            maxHeight: panelHeight,
            minHeight: panelHeight,
        }}
        title="Clients"
        titleStyle={{ color: transparentize(0.5, Colors.WHITE) }}
        headerChildren={headerChildren}
        headerContainerStyle={{ backgroundColor: Colors.TOOL_SIDEBAR }}
        queryDocs={{
          fetchAllQueryProps: { query: GET_CLIENTS },
          fetchSelectedQueryProps: { query: GET_SELECTED_CLIENT },
        }}
        panelItemConfig={panelItemConfig}
      />
    </ClientPanelContainer>
  )
}

export default ClientsPanel
