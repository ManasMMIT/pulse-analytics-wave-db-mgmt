import React from 'react'

import PanelItem from '../shared/PanelItem'

const ClientsPanelItem = ({
  client,
  style,
  handleSelect,
}) => (
  <PanelItem
    label={client.description}
    style={style}
    onClick={handleSelect.bind(null, { variables: { id: client.id } })}
  />
)

export default ClientsPanelItem
