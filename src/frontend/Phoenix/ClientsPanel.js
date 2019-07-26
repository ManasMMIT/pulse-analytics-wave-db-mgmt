import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import { GET_CLIENTS } from '../api/queries'
// import PanelItem from './shared/PanelItem'
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
  selectClient,
  selectedClient,
}) => (
  <Query query={GET_CLIENTS}>
    {({ data, loading, error }) => {
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
          <div>{
            data.clients.map(client => {
              const isSelected = selectedClient ? client.id === selectedClient.id : false
              const style = {
                cursor: isSelected ? 'default' : 'pointer',
                backgroundColor: isSelected ? '#1c4161' : null,
                padding: 24,
                color: isSelected ? '#ebf6fb' : '#7a97b1',
                borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
              }

              // const formConfig = {
              //   formTitle: 'Edit Client',
              //   formType: 'client',
              // }

              return (
                <div
                  key={client.id}
                  style={style}
                  onClick={() => selectClient({ variables: { id: client.id }})}
                >
                  {client.name}
                </div>
              );
            })
          }</div>
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
