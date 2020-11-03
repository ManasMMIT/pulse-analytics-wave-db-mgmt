import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Panel from '../../../components/Panel'
import CreateButton from './CreateButton'
// import DeleteButton from './DeleteButton'
import UpdateButton from './UpdateButton'

import { SELECT_CLIENT } from '../../../api/mutations'
import { GET_CLIENTS, GET_SELECTED_CLIENT } from '../../../api/queries'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

const phoenixLogo =
  'https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/phoenix-1-color.svg'

const ClientPanelContainer = styled.div({
  backgroundColor: Color.TOOL_SIDEBAR,
})

const PhoenixHeader = styled.div({
  alignItems: 'center',
  background: transparentize(0.3, Color.BLACK),
  color: Color.PHOENIX,
  display: 'flex',
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.S5} ${Spacing.S7}`,
  textTransform: 'uppercase',
  width: '100%',
})

const PhoenixLogo = styled.img({
  display: 'inline',
  marginRight: Spacing.S3,
})

const defaultPanelItemStyle = {
  cursor: 'pointer',
  color: transparentize(0.4, Color.WHITE),
  margin: `0 ${Spacing.S4}`,
  borderRadius: 4,
  padding: `${Spacing.S4} ${Spacing.S4}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const activePanelItemStyle = {
  color: Color.WHITE,
  background: transparentize(0.9, Color.WHITE),
}

const buttonGroupCallback = (client) => (
  <div style={{ display: 'flex' }}>
    <UpdateButton client={client} />
    {/* <DeleteButton clientId={client._id} /> */}
  </div>
)

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_CLIENT,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ description, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon ? (
        <div
          style={{
            background: Color.WHITE,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            marginRight: Spacing.S5,
          }}
        >
          <img
            style={{ width: 20, height: 'auto' }}
            src={icon}
            alt={`#{description}-icon`}
          />
        </div>
      ) : null}
      <span style={{ fontSize: 13 }}>{description}</span>
    </div>
  ),
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
          backgroundColor: Color.TOOL_SIDEBAR,
          maxWidth: 320,
          minWidth: 320,
          height: panelHeight,
          maxHeight: panelHeight,
          minHeight: panelHeight,
        }}
        title="Clients"
        titleStyle={{ color: transparentize(0.5, Color.WHITE) }}
        headerChildren={headerChildren}
        headerContainerStyle={{ backgroundColor: Color.TOOL_SIDEBAR }}
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
