import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Client from './Client'

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
  onClick,
  clients,
  selectedClient,
}) => (
  <Wrapper>
    <Title>Clients</Title>
    <div>{
      clients.map((client, idx) => {
        const  isSelected = client.id === selectedClient
        return (
          <Client
            key={client.id}
            onClick={onClick}
            client={client}
            isSelected={isSelected}
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
  onClick: PropTypes.func.isRequired,
  selectedClient: PropTypes.string,
}

export default ClientsPanel