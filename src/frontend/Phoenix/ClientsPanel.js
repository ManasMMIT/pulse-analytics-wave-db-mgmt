import React from 'react'
import styled from '@emotion/styled'
import { Query, Mutation } from 'react-apollo'

import { SELECT_CLIENT, CREATE_CLIENT } from '../api/mutations'
import { GET_CLIENTS } from '../api/queries'
import PanelItem from './shared/PanelItem'
import TextFormButton from './shared/TextForm/Button'

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
        if (loading) return null
        if (error) return <div>error</div>

        return (
          <Mutation mutation={SELECT_CLIENT}>
            {(handleSelect, { data: selectedEntityData, called }) => {
              if (!called) handleSelect()

              return (
                <div>
                  {
                    clients.map(client => {
                      let style = {
                        cursor: "pointer",
                        backgroundColor: "none",
                        padding: 24,
                        color: "#838c96",
                        borderLeft: "4px solid transparent",
                      }

                      if (selectedEntityData) {
                        const isSelected = client.id === selectedEntityData.selectedClient.id

                        style = {
                          cursor: isSelected ? 'default' : 'pointer',
                          backgroundColor: isSelected ? '#1c4161' : null,
                          padding: 24,
                          color: isSelected ? '#ebf6fb' : '#7a97b1',
                          borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
                        }
                      }

                      return (
                        <PanelItem
                          key={client.id}
                          label={client.description}
                          style={style}
                          onClick={handleSelect.bind(null, { variables: { id: client.id } })}
                        />
                      )
                    })
                  }
                </div>
              )
            }}
          </Mutation>
        )
      }}
    </Query>
  </Wrapper>
)

export default ClientsPanel
