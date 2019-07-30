import React from 'react'
import { Mutation } from 'react-apollo'
import { SELECT_CLIENT } from '../../api/mutations'

import ClientsPanelItem from './ClientsPanelItem'

const defaultStyle = {
  cursor: "pointer",
  backgroundColor: "none",
  padding: 24,
  color: "#838c96",
  borderLeft: "4px solid transparent",
}

const ClientsPanelItems = ({ clients }) => (
  <Mutation mutation={SELECT_CLIENT}>
    {(handleSelect, { called, data, loading }) => {

      return (
        <>
          {
            clients.map(client => {
              let style = defaultStyle

              if (data) {
                const isSelected = client.id === data.selectedClient.id

                const conditionalStyle = {
                  cursor: isSelected ? 'default' : 'pointer',
                  backgroundColor: isSelected ? '#1c4161' : null,
                  padding: 24,
                  color: isSelected ? '#ebf6fb' : '#7a97b1',
                  borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
                }

                style = { ...style, ...conditionalStyle }
              }

              return (
                <ClientsPanelItem
                  key={client.id}
                  style={style}
                  client={client}
                  handleSelect={handleSelect}
                />
              )
            })
          }
        </>
      )
    }}
  </Mutation>
)
  
  export default ClientsPanelItems
