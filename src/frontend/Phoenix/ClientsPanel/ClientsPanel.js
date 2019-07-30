import React from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import { CREATE_CLIENT } from '../../api/mutations'
import { GET_CLIENTS } from '../../api/queries'
import TextFormButton from '../shared/TextForm/Button'
import ClientsPanelItems from './ClientsPanelItems'

const Wrapper = styled.div({
  flex: 1,
  backgroundColor: '#0a3557',
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
})

const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginRight: 24,
  fontWeight: 700
})

const Title = styled.div({
  color: '#536f8d',
  fontSize: 20,
  fontWeight: 700,
  padding: 24,
})

const CREATE_BUTTON_TXT = 'Create Client'
const CREATE_MODAL_TITLE = 'Create New Client'
const createButtonStyle = {
  background: "#234768",
  color: 'white',
}

const ClientsPanel = () => (
  <Wrapper>
    <Header>
      <Title>Clients</Title>
      <TextFormButton
        modalTitle={CREATE_MODAL_TITLE}
        buttonLabel={CREATE_BUTTON_TXT}
        buttonStyle={createButtonStyle}
        mutationDoc={CREATE_CLIENT}
      />
    </Header>

    <Query query={GET_CLIENTS}>
      {({ data: { clients }, loading, error }) => {
        debugger
        if (loading) return null
        if (error) return <div>error</div>

        return <ClientsPanelItems clients={clients} />
      }}
    </Query>
  </Wrapper>
)

export default ClientsPanel
