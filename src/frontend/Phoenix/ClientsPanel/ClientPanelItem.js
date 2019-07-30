import React from 'react'
import PanelItem from '../shared/PanelItem'

const defaultStyle = {
  cursor: "pointer",
  backgroundColor: "none",
  padding: 24,
  color: "#838c96",
  borderLeft: "4px solid transparent",
}

const ClientPanelItem = ({
  selectedEntityData,
  client,
  handleSelect
}) => {
  let style = defaultStyle

  if (selectedEntityData) {
    const isSelected = client.id === selectedEntityData.selectedClient.id

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
    <PanelItem
      label={client.description}
      style={style}
      onClick={handleSelect.bind(null, { variables: { id: client.id } })}
    />
  )
}

export default ClientPanelItem
