import React from 'react'
import { Mutation } from 'react-apollo'

import PanelItem from '../shared/PanelItem'

import { SELECT_CLIENT } from '../../api/mutations'

const defaultStyle = {
  cursor: "pointer",
  backgroundColor: "none",
  padding: 24,
  color: "#838c96",
  borderLeft: "4px solid transparent",
}

const ClientsPanelItem = ({
  selectedClient,
  client,
}) => {
  let style = defaultStyle

  if (selectedClient) {
    const isSelected = client.id === selectedClient.id

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
    <Mutation mutation={SELECT_CLIENT}>
      {handleSelect => {
        return (
          <PanelItem
            label={client.description}
            style={style}
            onClick={handleSelect.bind(null, { variables: { id: client.id } })}
          />
        )}
      }
    </Mutation>
    )
  }
  
  export default ClientsPanelItem
