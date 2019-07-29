import React from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import { SELECT_CLIENT } from '../api/mutations'
import { GET_CLIENTS } from '../api/queries'
import Panel from './shared/Panel'
import TextFormButton from './shared/TextFormButton'

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
  <Query query={GET_CLIENTS}>
    {({ data, loading, error }) => {
      if (loading) return null
      if (error) return <div>error</div>

      return (
        <Wrapper>
          <Header>
            <Title>Clients</Title>
            <TextFormButton
              modalTitle={CREATE_MODAL_TITLE}
              buttonLabel={CREATE_BUTTON_TXT}
              buttonStyle={createButtonStyle}
            />
          </Header>

          <Panel
            mutationDoc={SELECT_CLIENT}
            data={data.clients.map(c => ({ ...c, text: c.description }))}
          />
        </Wrapper>
      )
    }}
  </Query>
)

export default ClientsPanel
