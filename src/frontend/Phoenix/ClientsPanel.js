import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import { SELECT_CLIENT } from '../api/mutations'
import { GET_CLIENTS, GET_SELECTED_CLIENT } from '../api/queries'
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

const ClientsPanel = ({
  // selectClient,
  // selectedClient,
}) => (
  <Query query={GET_CLIENTS}>
    {({
      data,
      loading,
      error,
      client, // direct access to apollo client
    }) => {
      if (loading) return null
      if (error) return <div>error</div>

      // client.mutate({ mutation: SELECT_CLIENT })

      return (
        <Wrapper>
          <Header>
            <Title>Clients</Title>
            <TextFormButton
              modalTitle={CREATE_MODAL_TITLE}
              buttonLabel={CREATE_BUTTON_TXT}
              buttonStyle={createButtonStyle}
              // handleSubmit={handlers.createHandler}
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

ClientsPanel.defaultProps = {
  clients: [],
}

ClientsPanel.propTypes = {
  clients: PropTypes.array,
  handlers: PropTypes.object,
  // selectedClient: PropTypes.string,
}

export default ClientsPanel
