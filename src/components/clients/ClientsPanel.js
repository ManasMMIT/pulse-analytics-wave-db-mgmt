import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import PanelItem from './../PanelItem'

const Wrapper = styled.div({
  flex: 1,
  backgroundColor: '#0a3557',
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
})

const Title = styled.div({
  color: '#536f8d',
  fontSize: 20,
  fontWeight: 700,
  padding: 24,
})

const ClientsPanel = ({
  handlers,
  clients,
  selectedClient,
}) => (
  <Wrapper>
    <Title>Clients</Title>
    <div>{
      clients.map(client => {
        const  isSelected = client.id === selectedClient
        const style = {
          cursor: isSelected ? 'default' : 'pointer',
          backgroundColor: isSelected ? '#1c4161' : null,
          padding: 24,
          color: isSelected ? '#ebf6fb' : '#7a97b1',
          borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
        }

        return (
          <PanelItem
            key={client.id}
            style={style}
            handlers={handlers}
            item={client}
            text={client.name}
          />
        )
      })
    }</div>
    </Wrapper>
)

ClientsPanel.defaultProps = {
  clients: [],
}

ClientsPanel.propTypes = {
  clients: PropTypes.array,
  handlers: PropTypes.object,
  selectedClient: PropTypes.string,
}

export default ClientsPanel
